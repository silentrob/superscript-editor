var wd = require("../node_modules/superscript/lib/wordnet"); 

exports.wordnetDefine = function(cb) {
  var args = Array.prototype.slice.call(arguments);
  var word;

  if (args.length == 2) {
    word = args[0];
  } else {
    word = this.message.words.pop();
  }

  wd.define(word, function(err, result){
    if (err) {
      cb(null,"");
    } else {
      cb(null, "The definition of " + word + " is " + result);    
    }
  });
}