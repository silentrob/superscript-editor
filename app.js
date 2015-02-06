// The main application script, ties everything together.

var mongoose = require('mongoose');
var sfact = require("sfacts");

var express = require('express');
var app = express();
 
var port = process.env.PORT || 3000;
var dbName = process.env.BOT || "testbot";

var config = { db: 'mongodb://localhost/' + dbName }
var options = { server: { socketOptions: { keepAlive: 1 } } };
var factSystem = sfact.create(dbName);

mongoose.connect(config.db, options);
var conn = mongoose.connection;

conn.once('open', function() {

  var models = require('superscript/lib/topics/index')(mongoose, factSystem);

  require('./config/express')(app);
   
  // set up the RESTful API, handler methods are defined in api.js

  var dashRoutes = require('./controllers/dashboard')(models);
  var gambitRoute = require('./controllers/gambits')(models);
  var topicsRoute = require('./controllers/topics')(models);

  app.get('/', dashRoutes.index);
  app.get('/docs', dashRoutes.docs);

  app.get('/gambits', gambitRoute.index);
  app.post('/gambits', gambitRoute.post); 
  app.get('/gambits/:id', gambitRoute.show)
  app.delete('/gambits/:id', gambitRoute.delete); 


  app.get('/topics', topicsRoute.index);
  app.post('/topics', topicsRoute.post); 
  app.post('/topics/:id/atf', topicsRoute.atf); 
  app.get('/topics/:id', topicsRoute.show)
  
  app.delete('/topics/:id', topicsRoute.delete); 

  var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('\n\n\tSuperScript Community Editor.\n\tListening at http://%s:%s\n\tBot Name: %s\n\n\tSwitch or create a new bot by starting `BOT=<name> node app.js`\n\n', host, port, dbName)
  });
});

module.exports = app;