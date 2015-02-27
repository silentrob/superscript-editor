
module.exports = function(models, bot) {

  return {
    index: function(req, res) {
      bot.factSystem.db.get({predicate: 'isa', object: 'concept' }, function(err, items){
        res.render('knowledge/index',{concepts:items});  
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

      console.log(req.body)

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
        res.render('knowledge/world', {concepts:items});
      });
    },

    addWorld: function(req, res) {
      console.log(req.body)

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

  }
}
