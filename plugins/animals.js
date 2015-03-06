var _ = require("underscore");

exports.aGender = function(gender, thing, cb) {
  this.facts.db.get({predicate:gender, object:thing}, function(e,r){
    if (!_.isEmpty(r)) {
      cb(null, r[0].subject);
    } else {
      cb(null,"");
    }
  });
}

exports.aBaby = function(thing, cb) {
  cb(null, thing);
}

exports.aLocation = function(thing, cb) {
  // cb(null, thing);
  this.facts.db.get({predicate:"habitat", object:thing}, function(e,r){
    if (!_.isEmpty(r)) {
      var str = "A " + thing + " lives in a " + r[0].subject;
      cb(null, str);
    } else {
      cb(null,"");
    }
  });
}


exports.aGroup = function(thing, cb) {
  cb(null, thing);
}