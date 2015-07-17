var _ = require("underscore");

module.exports = function(models, bot) {

  return {
    index: function(req, res) {
      bot.factSystem.db.get({predicate: 'isa', object: 'concept' }, function(err, items){
        res.render('knowledge/index',{concepts:items});
      });
    },

    graph: function(req, res) {
      bot.factSystem.db.get({limit: 2000, offset: 0}, function(err, items){
        var data1 = items.map(function(el, index){
          return el.subject;
        });
        
        var data2 = items.map(function(el, index){
          return el.object;
        });

        var data = _.unique(data1.concat(data2));

        // Gen IDs
        var data3 = [];
        data3 = data.map(function(item, index){
          return {id:'xx_'+index, name:item};
        });

        // nodes
        var nodes = data3.map(function(item, index){
          return {data: item};
        });

        // Edges
        var edges = items.map(function(item, index){
          var sourceID, targetID;
          for(var i = 0; i < data3.length; i++) {
            if (data3[i].name === item.subject) {
              sourceID = data3[i].id;
            }
          }
          
          for(var i = 0; i < data3.length; i++) {
            if (data3[i].name === item.object) {
              targetID = data3[i].id;
            }
          }

          return { data: { source: sourceID, target: targetID } };
        });

        res.render('knowledge/graph', {nodes: nodes, edges: edges});
      });
    },

    filter: function(req, res) {
      params = {};
      for (var x in req.query) {
        if (req.query[x] !== "") {
          params[x] = req.query[x];
        }
      }

      bot.factSystem.db.get(params, function(err, items) {
        res.render('knowledge/world', {concepts:items, params:params});
      });
    },
    
    concept: function(req, res) {
      bot.factSystem.db.get({subject:req.params.name}, function(err, data){
        res.render('knowledge/index',{concept: data});
      });
    },

    user: function(req, res) {
      // TODO: Change user by req.
      bot.getUser('testUser', function(err, user) {
        if (user) {
          user.memory.db.get({}, function(err, items) {
            res.render('knowledge/user',{concepts:items});
          });
        } else {
          res.render('knowledge/user',{concepts:[]});
        }
      });
    },
    
    userDelete: function(req, res) {
      var triple = { subject: req.body.s, predicate: req.body.p, object: req.body.o };
      
      bot.getUser('testUser', function(err, user) {
        if (user) {
          user.memory.db.del(triple, function(err) {
            res.sendStatus(200);
          });
        } else {
          res.sendStatus(200);
        }
      });
    },


    bot: function(req, res) {
      bot.memory.db.get({}, function(err, items) {
        res.render('knowledge/bot', {concepts:items});
      });
    },
    
    addBot: function(req, res) {
      var s = req.body.subject;
      var p = req.body.predicate;
      var v = req.body.object;

      if (s && p && v) {
        bot.memory.create(req.body.subject, req.body.predicate, req.body.object, false , function(err, items) {
          req.flash('success', 'Fact Created');
          res.redirect('back');
        });
      } else {
        req.flash('error', 'Missing Value');
        res.redirect('back');
      }
    },

    botDelete: function(req, res) {
      var triple = { subject: req.body.s, predicate: req.body.p, object: req.body.o };
      bot.memory.db.del(triple, function(err) {
        res.sendStatus(200);
      });
    },

    botImport: function(req, res) {
      bot.memory.loadFile([req.files.file.path], function(){
        res.redirect('back');
      });
    },

    world: function(req, res) {
      bot.factSystem.db.get({limit: 100, offset: 0}, function(err, items) {
        res.render('knowledge/world', {concepts:items, params: {}});
      });
    },

    addWorld: function(req, res) {

      var s = req.body.subject;
      var p = req.body.predicate;
      var v = req.body.object;

      if (s && p && v) {
        bot.factSystem.create(req.body.subject, req.body.predicate, req.body.object, false , function(err, items) {
          req.flash('success', 'Fact Created');
          res.redirect('back');
        });
      } else {
        req.flash('error', 'Missing Value');
        res.redirect('back');
      }
    },

    worldImport: function(req, res) {
      bot.factSystem.loadFile([req.files.file.path], function(){
        res.redirect('back');
      });
    },

    worldDelete: function(req, res) {
      var triple = { subject: req.body.s, predicate: req.body.p, object: req.body.o };
      bot.factSystem.db.del(triple, function(err) {
        res.sendStatus(200);
      });
    },

  };
};
