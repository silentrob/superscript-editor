var _ = require("underscore");
module.exports = function(models) {
  return {
    index : function(req, res) {
      models.topic.find({}, function(err, topics){
        res.render('topics/index', {topics: topics });
      });  
    },

    post: function(req, res) {
      var topicName = req.body.name.toLowerCase();
      topicName = topicName.replace(/\s/g,"_");

      var keywords = req.body.keywords.split(",");
      var system = (req.body.keywords == "on") ? true : false;

      if (topicName != "") {
        new models.topic({name: topicName, keywords: keywords, system: system }).save(function(err){
          if (req.body.name !== topicName) {
            req.flash('success', 'Gambit Created, but we changed the name.');
          } else {
            req.flash('success', 'Gambit Created');  
          }

          res.redirect('/topics');
        });        
      } else {
        req.flash('error', 'Topic Name is required.')
        res.redirect("/topics");
      }
    },

    atf: function(req, res) {
      // console.log(req.body);
      if (req.body.topics) {
        var topics = req.body.topics
        return models.topic.findById(req.params.id, function(error, topic) {
          if (_.isString(topics)) {
            topics = [topics];
          }

          for (var i = 0; i < topics.length; i++) {
            topic.gambits.addToSet(topics[i]);  
          }
          
          topic.save(function(err){
            req.flash('success', 'Topic Updated')
            res.redirect("/topics/" + req.params.id);
          });

        });
      } else {
        req.flash('error', 'No Gambits selected.')
        res.redirect("/topics/" + req.params.id);
      }
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
        // We bring in all the gambits so we can add them to the topic.
        models.gambit.find({},'_id, input', function(error, gambits) {
          res.render('topics/get', {topic: topic, gambits:gambits });
        });
      });
    }
  }
}
