
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
    
    bot: function(req, res) {
      bot.memory.db.get({}, function(err, items) {
        res.render('knowledge/bot', {concepts:items});
      });
    },
    
    botDelete: function(req, res) {
      var triple = { subject: req.body.s, predicate: req.body.p, object: req.body.o };
      bot.memory.db.del(triple, function(err) {
        res.send(200);
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

    worldImport: function(req, res) {
      bot.factSystem.loadFile([req.files.file.path], function(){
        res.redirect('back');  
      });
    },

    worldDelete: function(req, res) {
      var triple = { subject: req.body.s, predicate: req.body.p, object: req.body.o };
      bot.factSystem.db.del(triple, function(err) {
        res.send(200);
      });
    },

  }
}
