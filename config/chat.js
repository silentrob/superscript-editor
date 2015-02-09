module.exports = function(io, bot) {
  io.on('connection', function(socket) {
    var user_id = socket.handshake.address;
    socket.emit('chat message', {text:'Welcome to the real-time editor.'});
    
    socket.on('chat message', function(msg){
      // Emit the message back first
      // socket.emit('chat message', { text: msg });
      bot.reply(user_id, msg.trim(), function(err, resObj){
        socket.emit('chat message', { text: resObj.string });
      });
    });
  });
}