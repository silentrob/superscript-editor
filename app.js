// The main application script, ties everything together.

var mongoose = require('mongoose');
var sfact = require("sfacts");
var ss = require("superscript");

var express = require('express');
var app = express();

var appServer = require('http').Server(app);
var io = require('socket.io')(appServer);

var port = process.env.PORT || 3000;
var dbName = process.env.BOT || "testbot";

var config = { db: 'mongodb://localhost/' + dbName };
var options = { server: { socketOptions: { keepAlive: 1 } } };
var factSystem = sfact.create(dbName);

var findOrCreate = require('mongoose-findorcreate');
var settingsSchema = new mongoose.Schema({ key:  String, value: String });
settingsSchema.plugin(findOrCreate);
Settings = mongoose.model('Settings', settingsSchema);

mongoose.connect(config.db, options, function(err){
  if (err) console.log("Error connecting to the MongoDB --", err);
});

var botOptions = {
  mongoose : mongoose,
  factSystem: factSystem,
  editMode : true
};

app.projectName = dbName;
var conn = mongoose.connection;

conn.once('open', function() {

  var models = require('superscript/lib/topics/index')(mongoose, factSystem);

  require('./config/express')(app);
   
  new ss(botOptions, function(err, botInstance){
    require('./config/chat')(io, botInstance, models);

    var dashRoutes = require('./controllers/dashboard')(models, botInstance, app.projectName);
    var gambitRoute = require('./controllers/gambits')(models, botInstance);
    var topicsRoute = require('./controllers/topics')(models, botInstance);
    var repliesRoute = require('./controllers/replies')(models, botInstance);
    var pluginsRoute = require('./controllers/plugins')(models, botInstance);
    var knowledgeRoute = require('./controllers/knowledge')(models, botInstance);

    // General routs
    app.get('/', dashRoutes.index);
    app.get('/docs', dashRoutes.docs);
    app.get('/settings', dashRoutes.settings);
    app.post('/settings/slack', dashRoutes.postSlack);
    app.get('/import', dashRoutes.load);
    app.post('/import', dashRoutes.postdata);

    // Plugin JSON
    app.get('/plugins', pluginsRoute.getJSON);

    app.get('/knowledge', knowledgeRoute.index);
    app.get('/knowledge/user', knowledgeRoute.user);
    app.get('/knowledge/bot', knowledgeRoute.bot);
    app.get('/knowledge/world', knowledgeRoute.world);
    app.get('/knowledge/concept/:name', knowledgeRoute.concept);
    app.get('/knowledge/world/filter', knowledgeRoute.filter);

    app.post('/knowledge/bot', knowledgeRoute.addBot);
    app.post('/knowledge/world', knowledgeRoute.addWorld);
    
    app.delete('/knowledge/user', knowledgeRoute.userDelete);
    app.delete('/knowledge/bot', knowledgeRoute.botDelete);
    app.delete('/knowledge/world', knowledgeRoute.worldDelete);

    app.post('/knowledge/bot/import',knowledgeRoute.botImport);
    app.post('/knowledge/world/import',knowledgeRoute.worldImport);
    app.post('/knowledge/concepts/import', knowledgeRoute.worldImport);

    // Gambits CRUD and nested replies
    app.get('/gambits', gambitRoute.index);
    app.post('/gambits', gambitRoute.post);

    app.get('/replies', repliesRoute.index);
    app.get('/replies/:id', repliesRoute.show);
    app.delete('/replies/:id', repliesRoute.delete);
    
    app.post('/gambits/quick', gambitRoute.quickPost);
    app.post('/gambits/:id', gambitRoute.post);

    app.get('/gambits/new', gambitRoute.new);
    app.put('/gambits/:id', gambitRoute.update);
    app.get('/gambits/:id', gambitRoute.show);
    app.delete('/gambits/:id', gambitRoute.delete);

    app.get('/gambits/:id/replies', gambitRoute.replies);

    app.post('/gambits/:id/reply', gambitRoute.reply);
    app.delete('/gambits/:id/reply', gambitRoute.deleteReply);
    app.put('/gambits/:id/reply/:rid', gambitRoute.updateReply);
    app.post('/gambits/:id/test', gambitRoute.test);

    // Topics
    app.get('/topics', topicsRoute.index);
    app.post('/topics', topicsRoute.post);
    app.get('/topics/:id', topicsRoute.show);
    app.put('/topics/:id', topicsRoute.update);
    app.delete('/topics/:id', topicsRoute.delete);
    app.post('/topics/:id/test', topicsRoute.test);
    app.post('/topics/:id/sort', topicsRoute.sort);
    app.post('/topics/:id/reorder', topicsRoute.reorder);
  });

  var server = appServer.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('\n\n\tSuperScript Community Editor.\n\tListening at http://%s:%s\n\tBot Name: %s\n\n\tSwitch or create a new bot by starting `BOT=<name> node app.js`\n\n', host, port, dbName);
  });
});

module.exports = app;