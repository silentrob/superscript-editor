var exec = require('child_process').exec;
var slackClient;
module.exports = function(models, bot, project) {

  return {
    index: function(req, res) {
      models.topic.find({}, null, {sort:{name:1}}, function(err, topics) {
        res.render('index', { title: 'SuperScript Community Editor', topics: topics });
      });
    },

    settings: function(req, res) {
      Settings.find({key:'token'}, function(e,r){
        
        var token = (r && r.length != 0) ? r[0].value : "";
        res.render('settings', {token:token});
        
      });
    },

    postSlack: function(req, res) {
      if (req.body.token != "") {
        var prop = {key:'token', value: req.body.token };
        Settings.findOrCreate({key:'token'}, prop, function(err, item, isNew){
          item.save(function(err, result){

            if (req.body.start) {
              var evars = {
                'TOKEN': req.body.token,
                'PROJECT': project
              };
              if (slackClient) {
                req.flash('error', 'Slack Client Already Running');
              } else {
                slackClient = exec('node ./lib/slack.js', {env: evars});
                req.flash('success', 'Slack Client Enabled');
              }

              res.redirect('back');
            } else {

              if (slackClient) {
                slackClient.kill('SIGKILL');
                slackClient = null;
                req.flash('success', 'Slack Client Disabled');
              }
              res.redirect('back');
            }
          });
        });        
      } else {
        res.flash("error")
        res.redirect('back');  
      }
    },

    docs: function(req, res) {
      res.render('docs');
    },
    
    load: function(req, res) {
      res.render('import');
    },

    postdata: function(req, res) {
      if (req.files && req.files.file && req.files.file.path) {
        models.importer(req.files.file.path, function(){
          req.flash("success","Data file Imported");
          res.redirect("/");  
        });        
      } else {
        req.flash("error","Missing Data file.");
        res.redirect("back");  
      }
    }

  }
}
