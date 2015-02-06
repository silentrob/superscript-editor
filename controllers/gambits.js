
module.exports = function(models) {
  return {
    index : function(req, res) {
      models.topic.find({}, function(err, topics){
        models.gambit.find({}).populate('replies').exec(function(err, gambits){
          res.render('gambits/index', {gambits: gambits, topics:topics });
        });
      });  
    },

    post: function(req, res) {

      if (req.body.input == "") {
        req.flash('error', 'Input is Required.')
        res.redirect('/gambits');
      } else {

        console.log(req.body)
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
      return models.gambit.findById(req.params.id, function(error, gambit) {
        res.render('gambits/get', {gambit: gambit });
      })
    }
  }
}
