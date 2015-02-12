
// Code to count how many capture groups
// var arbitrary_regex = /(1(2(3)))(?:A)()4(?=B)[(C)][(]D[)]\(E\)(5)/;
// var num_groups = (new RegExp(arbitrary_regex.toString() + '|')).exec('').length - 1;
// alert(num_groups);

// var num_groups = (new RegExp(re.toString() + '|')).exec('').length - 1;

module.exports = function(models) {
  return {
    index : function(req, res) {
      models.topic.find({}, function(err, topics){
        models.gambit.find({}).populate('replies').exec(function(err, gambits){
          res.render('gambits/index', {gambits: gambits, topics:topics });
        });
      });  
    },

    // Add a reply to a gambit
    deleteReply: function(req, res) {

      var remMe = {$pull: {replies: req.body.replyId }};
      models.gambit.findByIdAndUpdate(req.params.id, remMe, function(err, me) {
        // We should also delete the reply object and not leave it orphaned.
        models.reply.find({ id: req.body.replyId }).remove().exec();
        res.sendStatus(200);
      });
    },
    // Update an existing reply
    updateReply: function(req, res) {
      var props = {
        reply: req.body.reply,
        filter: req.body.filter
      };
      models.reply.findByIdAndUpdate(req.params.rid, props, function(err, me) {
        console.log(err, me);
        res.sendStatus(200);
      });
    },

    reply: function(req, res) {
      var properties = {
        reply: req.body.reply,
        filter: req.body.filter
      };

      models.reply.create(properties, function(err,rep){
        rep.save(function(){
          var addMe = {$addToSet: {replies: rep._id}};
          models.gambit.findByIdAndUpdate(req.params.id, addMe, function(err, me) {
            res.status(201).send(rep);  
          });
        });
      });
    },

    // JSON endpoint to fetch all replies
    replies: function(req, res) {
      return models.gambit.findById(req.params.id).populate('replies').exec(function(err, gambit){
        res.json(gambit.replies);
      });
    },

    update: function(req, res) {

      var gambitParams = {
        input: req.body.input,
        isQuestion: (req.body.isQuestion == "on") ? true : false,
        qType: req.body.qType
      }

      models.gambit.findByIdAndUpdate(req.params.id, gambitParams, function(err, me) {
        req.flash('success', 'Gambit updated.')
        res.redirect('/gambits/' + req.params.id);
      });
    },

    // Test a gambit against input
    test: function(req, res) {
      return models.gambit.findById(req.params.id, function (err, gambit) {
        gambit.doesMatch({clean:req.body.phrase}, function(err, result){
          res.json({isValid:result});
        });        
      });
    },

    quickPost: function(req, res) {

      if (req.body.input == "" || req.body.reply == "") {
        res.json({error:'missing Input'});
      } else {
        var isQuestion = (req.body.isQuestion == "on") ? true : false;
        var gambitParams = {
          input: req.body.input,
          isQuestion: isQuestion,
          qType: req.body.qType
        }
        var gambit = new models.gambit(gambitParams);
        var replyParams = {
          reply: req.body.reply
        }
        
        models.reply.create(replyParams, function(err,reply){
          gambit.replies.addToSet(reply._id);
          gambit.save(function(err){

            var remMe = {$addToSet: {gambits: gambit._id }};
            models.topic.findOne({name:'random'},  function(err, topic) {
              topic.update(remMe, function(err, xxx){
                res.json({success:true});  
              });
              
            });
          });
        });
      }
    },

    post: function(req, res) {

      if (req.body.input == "") {
        req.flash('error', 'Input is Required.')
        res.redirect('/gambits');
      } else {
        var isQuestion = (req.body.isQuestion == "on") ? true : false;
        var gambitParams = {
          input: req.body.input,
          isQuestion: isQuestion,
          qType: req.body.qType
        }
        var gambit = new models.gambit(gambitParams);
      
        if (req.body.reply != "") {
          var replyParams = {
            reply: req.body.reply
          }
          
          models.reply.create(replyParams, function(err,reply){
            gambit.replies.addToSet(reply._id);
            gambit.save(function(err){
              req.flash('success', 'Gambit Created')
              res.redirect('/gambits');
            });

          });

        } else {
          // No Reply Obj.. Just trigger
          gambit.save(function(err){
            req.flash('success', 'Gambit Created')
            res.redirect('/gambits');
          });
        }
      }
    },

    delete: function (req, res) {
      return models.gambit.findById(req.params.id, function (err, item) {
        if (!item) {
          return res.sendStatus(410);
        } else {
          return item.remove(function (err) {
            if (!err) {
              return res.send('');
            } else {
              console.log(err);
            }
          });          
        }
      });
    },

    show: function(req, res) {
      return models.gambit.findById(req.params.id).exec(function(error, gambit) {
        // what links to this gambit
        return models.topic.find({ gambits: gambit._id }).exec(function(error, topics) {
          
          res.render('gambits/get', {gambit: gambit, topics: topics});

        });
      });
    }
  }
}
