var _ = require("underscore");
var Utils  = require("superscript/lib/utils");

exports.getFavorite = function(thing, cb) {
  var that = this;
  var message = this.message;
  var suggest = "";
  var facts = that.facts.db;
  var userfacts = that.user.memory.db;
  var botfacts = that.botfacts.db;
  
  var cleanThing = thing.toLowerCase();
  cleanThing = cleanThing.replace(/\s/g,"_");

  botfacts.get({subject:'favorite', predicate: cleanThing}, function(err, list) {
    if (!_.isEmpty(list)) {
      var favThing = Utils.pickItem(list);
      var favThing = favThing.object.replace(/_/g, " ");
      cb(null, "My favorite " + thing + " is " + favThing + ".");
    } else {
      // Quibble can handle this.
      cb(null, "");
    }
  });
}