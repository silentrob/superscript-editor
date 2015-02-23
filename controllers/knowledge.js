
module.exports = function(models, bot) {

  return {
    index: function(req, res) {
      res.render('knowledge/index',{});
    },
    
    user: function(req, res) {
      res.render('knowledge/user',{});
    },
    
    bot: function(req, res) {
      res.render('knowledge/bot',{});
    },
    
    world: function(req, res) {
      res.render('knowledge/world',{});
    }
  }
}
