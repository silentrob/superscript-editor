
module.exports = function(models) {

  return {
    index: function(req, res) {
      res.render('index', { title: 'SuperScript Community Editor'});
    },

    docs: function(req, res) {
      res.render('docs');
    }
    
  }
}
