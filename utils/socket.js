const { Server } = require("socket.io");

module.exports = (server) => {
    const io = new Server(server);
    let users = [];
    io.on('connection', (socket) => {
        socket.on('join-room', (roomId, userId, userName) => {
            
            if(users.length != 0){
                let checkFlag = false;
                for(let x in users){
                    if((users[x].id == userId) && (users[x].roomId == roomId){
                        checkFlag = true;
                    }
                }

                if(!checkFlag){
                    users.push({
                        id: userId,
                        name: userName,
                        roomId:roomId
                    });
                }
            }else{
                users.push({
                    id: userId,
                    name: userName,
                    roomId:roomId
                });
            }
                
            socket.join(roomId);
            socket.to(roomId).emit('user-connected', userId);
            socket.on('disconnect', () => {
                users = users.filter((element) => {
                    if((element.id != userId)){
                        return element;
                    }
                });
                socket.to(roomId).emit('user-disconnected', {userId, users});
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