var _ = require("underscore");
var async = require("async");

module.exports = function(models, bot) {
  return {
    index : function(req, res) {
      models.topic.find({}, null, {sort:{name:1}}, function(err, topics){
        res.render('topics/index', {topics: topics });
      });  
    },

    post: function(req, res) {
      var topicName = req.body.name.toLowerCase();
      topicName = topicName.replace(/\s/g,"_");

      var keywords = req.body.keywords.split(",");
      var system = (req.body.system == "on") ? true : false;

      if (topicName != "") {
        new models.topic({name: topicName, keywords: keywords, system: system, keep:true }).save(function(err){
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

    update: function(req, res) {
      var topicName = req.body.name.toLowerCase();
      topicName = topicName.replace(/\s/g,"_");

      var keywords = req.body.keywords.split(",");
      var system = (req.body.system == "on") ? true : false;
      var keep = (req.body.keep == "on") ? true : false;

      if (topicName != "") {
        models.topic.findById(req.params.id, function (err, topic) {
          topic.keywords = keywords;
          topic.name = topicName;
          topic.keep = keep;
          topic.system = system;
          topic.save(function(){
            req.flash('success', 'Gambit Created');  
            res.redirect('back');
          });
        }); 
      } else {
        req.flash('error', 'Topic Name is required.')
        res.redirect("back");
      }
    },


    delete: function (req, res) {
      return models.topic.findById(req.params.id, function (err, item) {
        if (!item) {
          return res.sendStatus(410);
        } else {
          return item.remove(function (err) {
            return res.sendStatus(200);
          });          
        }
      });
    },

    sort: function(req, res) {
      models.topic.findById(req.params.id, function(err, topic) {
        topic.sortGambits(function() {
          res.redirect('back');
        });
      });
    },

    show: function(req, res) {

      models.topic.findById(req.params.id, function(err, topic) {
        
        var iter = function (gambit, cb) {
          Reply.populate(gambit, { path: 'replies' }, cb);
        };
        
        models.topic.findById(req.params.id).populate('gambits').exec(function(error, topic) {

          async.each(topic.gambits, iter, function done(err) {
            // We bring in all the gambits so we can add them to the topic.          
            models.gambit.find({},'_id, input', function(error, gambits) {
              res.render('topics/get', {topic: topic, gambits:gambits });
            });
          });
        });

      });
      

    },

    // Test a topic against input
    test: function(req, res) {
      return models.topic.findById(req.params.id, function (err, topic) {
        bot.message(req.body.phrase, function(err, messageObj){
          topic.doesMatch(messageObj, function(err, result){
            res.json(result);
          });                  
        })
      });
    },
  }
}
