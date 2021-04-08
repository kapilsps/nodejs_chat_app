const { Server } = require("socket.io");

module.exports = (server) => {
    const io = new Server(server);
    const users = [];
    io.on('connection', (socket) => {
        socket.on('join-room', (roomId, userId, userName) => {
            
            if(users.length != 0){
                users.forEach((element) => {
                    if(element.id == userId){
                        return;
                    }
                    users.push({
                        id: userId,
                        name: userName,
                        roomId:roomId
                    });
                });
            }else{
                users.push({
                    id: userId,
                    name: userName,
                    roomId:roomId
                });
            }
                
            console.log(users);
            socket.join(roomId);
            socket.to(roomId).emit('user-connected', userId);
            socket.on('disconnect', () => {
                socket.to(roomId).emit('user-disconnected', userId);
            });

            /**
             * chat message
             */
            socket.on('message', (msg, username) => {
                io.to(roomId).emit('createMessage', {msg, username});
            });

            /**
             * user added
             */
             io.to(roomId).emit('addParticipants', users);
        }); 
    });
}