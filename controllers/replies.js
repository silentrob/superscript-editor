var _ = require("underscore");
var async = require("async");

module.exports = function(models) {
  return {
    index : function(req, res) {
      models.reply.find({}, function(err, replies) {
        res.render('replies/index', {replies:replies});
      });
    },
    
    show : function(req, res) {
      return models.reply.findById(req.params.id).populate('gambits').exec(function(error, replies) {
        var iter = function (gambit, cb) {
          Gambit.populate(gambit, { path: 'replies' }, cb);
        };

        async.each(replies.gambits, iter, function done(err) {
          res.render('replies/get', {replies:replies});
        });
      });
    }
  }
}
