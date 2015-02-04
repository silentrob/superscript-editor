// The main application script, ties everything together.
 
var express = require('express');
var mongoose = require('mongoose');
var superscript = require('superscript');

var app = express();
 
var port = process.env.PORT || 3000;
var dbName = process.env.BOT || "testbot";

var config = {
  db: 'mongodb://localhost/' + dbName
}
 // Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};

// Connect to Mongo when the app initializes
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);
 
require('./config/express')(app);
 
// set up the RESTful API, handler methods are defined in api.js
var api = require('./controllers/api.js');
var dash = require('./controllers/dashboard.js');
var topics = require('./controllers/topics.js');
var gambits = require('./controllers/gambits.js');

// app.post('/thread', api.post);
// app.get('/thread/:title.:format?', api.show);
// app.get('/thread', api.list);

app.get('/', dash.index);
app.get('/topics', topics.index);
app.get('/gambits', gambits.index);
app.get('/docs', dash.docs);
 

var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('\n\n\tSuperScript Community Editor.\n\tListening at http://%s:%s\n\tBot Name: %s\n\n', host, port, dbName)
  
});

