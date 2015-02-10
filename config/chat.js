module.exports = function(io, bot) {
  io.on('connection', function(socket) {
    var user_id = socket.handshake.address;
    socket.emit('chat message', {string:'Welcome to the real-time editor.'});
    
    socket.on('chat message', function(msg){
      // Emit the message back first
      bot.reply(user_id, msg.trim(), function(err, resObj){
        socket.emit('chat message', resObj);
      });
    });
  });
}