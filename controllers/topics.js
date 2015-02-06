
module.exports = function(models) {
  return {
    index : function(req, res) {
      models.topic.find({}, function(err, topics){
        res.render('topics/index', {topics: topics });
      });  
    },

    post: function(req, res) {
      var keywords = req.body.keywords.split(",");
      var system = (req.body.keywords == "on") ? true : false;
      new models.topic({name: req.body.name, keywords: keywords, system: system }).save(function(err){
        res.redirect('/topics');
      });
    },

    delete: function (req, res) {
      return models.topic.findById(req.params.id, function (err, item) {
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
      return models.topic.findById(req.params.id, function(error, topic) {
        res.render('topics/get', {topic: topic });
      })
    }
  }
}
