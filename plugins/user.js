var debug = require("debug")("UserFacts");
var _ = require("underscore");
var Utils = require("superscript/lib/utils");

exports.save = function(key, value, cb) {
  var memory = this.user.memory;
  var userId = this.user.id;

  memory.db.get({subject:key, predicate: userId }, function(err, results) {
    if (!_.isEmpty(results)) {
      memory.db.del(results[0], function(){
        memory.db.put({subject:key, predicate: userId, object: value}, function(){
          cb(null,"");
        });
      });
    } else {
      memory.db.put({subject:key, predicate: userId, object: value}, function(err){
        cb(null, "");
      });  
    }
  });
}

exports.get = function(key, cb) {
  
  var memory = this.user.memory;
  var userId = this.user.id;

  debug("getVar", key, userId);
  
  memory.db.get({subject:key, predicate: userId}, function resultHandle(err, res){
    if (res && res.length != 0) {
      cb(err, res[0].object);
    } else {
      cb(err, null);
    }
  });
}

exports.createUserFact = function(s,v,o,cb) {

  if (s != "undefined" && v != "undefined" && o != "undefined") {
    this.user.memory.create(s,v,o,false, function(){
      cb(null,"");
    });
  } else {
    debug("Possible Error with fact", this.message.raw);
    cb(null,"")
  }
    
}


// What does my dad like to play?
exports.resolveUserFact = function(subject, verb, cb) {
  var subject = subject.replace(/\s/g,"_").toLowerCase();

  console.log("resolveUserFact", subject, verb);
  var memory = this.user.memory;
  memory.db.get({subject:subject, predicate:verb}, function(err, result){
    if (!_.isEmpty(result)) {
      cb(null, result[0].object);
    } else {
      memory.db.get({object:subject, predicate:verb}, function(err, result){
        if (!_.isEmpty(result)) {
          cb(null, result[0].subject);
        } else {
          cb(null,"");
        }
      });
    }
  });
}


// We check to see if we know the name in the message object
exports.known = function(bool, cb) {
  var memory = this.user.memory;
  var name = (this.message.names && !_.isEmpty(this.message.names)) ? this.message.names[0] : "";
  memory.db.get({subject:name.toLowerCase()}, function resultHandle(err, res1){    
    memory.db.get({object:name.toLowerCase()}, function resultHandle(err, res2){      
      if (_.isEmpty(res1) && _.isEmpty(res2)) {
        cb(null, (bool == "false") ? true : false)
      } else {
        cb(null, (bool == "true") ? true : false)
      }
    });
  });
}


exports.inTopic = function(topic, cb) {
  if (topic == this.user.currentTopic) {
    cb(null, "true");
  } else {
    cb(null, "false");
  }   
}