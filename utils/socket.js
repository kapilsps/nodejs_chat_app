const { Server } = require("socket.io");

module.exports = (server) => {
    const io = new Server(server);
    io.on('connection', socket => {
        // console.log(socket);
        socket.on('join-room', (roomId, userId) => {
          console.log(roomId, userId);
          socket.join(roomId);
          socket.to(roomId).broadcast.emit('user-connected', userId);
          socket.on('disconnect', () => {
              socket.to(roomId).broadcast.emit('user-disconnected', userId);
          });
        });
    });
}