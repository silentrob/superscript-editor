
module.exports = function(models) {

  return {
    index: function(req, res) {
      models.topic.find({}, null, {sort:{name:1}}, function(err, topics) {
        res.render('index', { title: 'SuperScript Community Editor', topics: topics });
      });
    },

    docs: function(req, res) {
      res.render('docs');
    },
    
    load: function(req, res) {
      res.render('import');
    },

    postdata: function(req, res) {
      console.log(req.files.file.path);

      models.importer(req.files.file.path, function(){
        req.flash("success","Data file Imported");
        res.redirect("/");  
      });
    }

  }
}
