
var debug = require("debug")("Reason Plugin");
var history = require("../node_modules/superscript/lib/history");
var Utils = require("../node_modules/superscript/lib/utils");
var wd = require("../node_modules/superscript/lib/wordnet"); 
var _ = require("underscore");
var moment = require("moment");

exports.usedFor = function(cb) {
  var that = this;
  this.cnet.usedForForward(that.message.nouns[0], function(e,r){
    if (!_.isEmpty(r)) {
      var res = (r) ? Utils.makeSentense(r[0].sentense)  : "";
      cb(null, res);
    } else {
      cb(null,"");
    }
  });
}

exports.putA = function(cb) {
  var that = this;
  var thing = (that.message.entities[0]) ? that.message.entities[0] : that.message.nouns[0];
  var userfacts = that.user.memory.db;

  if (thing) {
    this.cnet.putConcept(thing, function(e, putThing){
      if (putThing) {
        cb(null, Utils.makeSentense(Utils.indefiniteArticlerize(putThing)));
      } else {
        cb(null, "");
      }
    });
  }
}

exports.isA = function(cb) {
  var that = this;
  var thing = (that.message.entities[0]) ? that.message.entities[0] : that.message.nouns[0];
  var userfacts = that.user.memory.db;
  var userID = that.user.name;

  if (thing) {
    this.cnet.isAForward(thing, function(e,r){
      if (!_.isEmpty(r)) {
        var res = (r) ? Utils.makeSentense(r[0].sentense)  : "";
        cb(null, res);
      } else {
        // Lets try wordnet
        wd.define(thing, function(err, result){
          if (err) {
            cb(null, "");
          } else {
            cb(null, result);
          }          
        });
      }
    });
  } else {
    var thing = "";
    // my x is adj => what is adj
    if (that.message.adverbs[0]) {
      thing = that.message.adverbs[0];
    } else {
      thing = that.message.adjectives[0];
    }
    userfacts.get({object:thing, predicate: userID}, function(err, list) {
      if (!_.isEmpty(list)){
        // Because it came from userID it must be his
        cb(null, "You said your " + list[0].subject + " is " + thing + ".");
      } else {
        // find example of thing?
        cb(null, "");
      }      
    });
  }
}

