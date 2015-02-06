
module.exports = function(models) {
  return {
    index : function(req, res) {
      models.topic.find({}, function(err, topics){
        models.gambit.find({}, function(err, gambits){
          res.render('gambits/index', {gambits: gambits, topics:topics });
        });
      });  
    },

    post: function(req, res) {

      if (req.body.input == "") {
        req.flash('error', 'Input is Required.')
        res.redirect('/gambits');
      } else {
        var isQuestion = (req.body.isQuestion == "on") ? true : false;
        var gambitParams = {
          input: req.body.input,
          isQuestion: isQuestion
        }
        new models.gambit(gambitParams).save(function(err){
          req.flash('succes', 'Gambit Created')
          res.redirect('/gambits');
        });
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
