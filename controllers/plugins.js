
module.exports = function(models, bot) {

  return {
    getJSON: function(req, res) {
      res.json(Object.keys(bot.getPlugins()));
    }
  }
}
