var _ = require("underscore");
var async = require("async");

module.exports = function(models) {
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
      var system = (req.body.keywords == "on") ? true : false;

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

    show: function(req, res) {
      return models.topic.findById(req.params.id).populate('gambits').exec(function(error, topic) {
        
        // expand the replies too.
        
        var iter = function (gambit, cb) {
          Reply.populate(gambit, { path: 'replies' }, cb);
        };

        async.each(topic.gambits, iter, function done(err) {
          // We bring in all the gambits so we can add them to the topic.
          
          models.gambit.find({},'_id, input', function(error, gambits) {
            res.render('topics/get', {topic: topic, gambits:gambits });
          });
        });

      });
    }
  }
}
