const socket = io();
const videoGrid = document.getElementById('video-grid');
const peers = {};
const myPeer = new Peer(undefined, {
    host:'/',
    port:'3001'
});
const inputMessage = document.getElementById('input-message');
const myVideo = document.createElement('video');
    myVideo.muted = true;
let myVideoStream;
let screenShareStream;
let myuserId;

/**show chat box */
$('#chat-button').click(function(){
    $('#chat').toggle();
    $('#participants').toggle();
});
/**end chat box */

/**paticipants box */
$('#participants-button').click(function(){
    $('#participants').toggle();
    $('#chat').toggle();
});
/**end of participants box */

/**audio */
$('#mute-button').click(function() {
    $(this).toggle();
    $('#unmute-button').toggle();
    muteUnmute();
});

$('#unmute-button').click(function() {
    $(this).toggle();
    $('#mute-button').toggle();
    muteUnmute();
});

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
    }else{
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}
/**end audio */

/**video */
$('#stop-video-button').click(function() {
    $(this).toggle();
    $('#play-video-button').toggle();
    playStop();
});

$('#play-video-button').click(function() {
    $(this).toggle();
    $('#stop-video-button').toggle();
    playStop();
});

const playStop = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
    }else{
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

/**end video */

/** chat message start */
document.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
      socket.emit('message', inputMessage.value, USER_NAME);
      inputMessage.value = '';
    }
});

socket.on('createMessage', (data) => {
    $('#message-window').append('<li><b>'+data.username+'</b>:  '+data.msg+'</li>');
    $('#message-window').scrollTop($('#message-window').prop('scrollHeight'));
});

/**chat message end */

/**get user audio and video */
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream => {
    myVideoStream = stream;

    addVideoStream(myVideo,stream);
    myPeer.on('call', call => {
        call.answer(stream);
        const video = document .createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
    });
    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    });
}).catch(err => {
    console.log(err);
});
/**end of user audio video */


/**screen share */
$('#present-screen-button').click(() => {
    navigator.mediaDevices.getDisplayMedia({video:true, cursor:true})
            .then(stream => {
                screenShareStream = stream;
                $('#present-screen-button').toggle();
                $('#stop-screen-button').toggle();

                // const video = document.createElement('video');
                // addVideoStream(video, stream);
                myPeer.call(myuserId, stream);

            }).catch(e => {
                console.log(e);
            });
});

$('#stop-screen-button').click(() => {
    screenShareStream.getVideoTracks()[0].stop();
    myPeer.call(myuserId, myVideoStream);
    $('#present-screen-button').toggle();
    $('#stop-screen-button').toggle();
});

/**end of screen share */

/** join room */
myPeer.on('open', id => {
    myuserId = id;
    socket.emit('join-room', ROOM_ID, id, USER_NAME);
});

/**end of room */

/**user connected and disconneted */

socket.on('user-disconnected', userId => {
    if(peers[userId]){
        peers[userId].close();
    }
});

/**user connected and disconneted end */

/**user add */
socket.on('addParticipants', (data) => {
    $('#participants-list li').remove();
    data.forEach(element => {
        if(element.roomId == ROOM_ID){
            $('#participants-list').append(`<li>${element.name}</li>`);
        }
    });
});

/**end of user add */

function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream);
    const video =  document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });

    call.on('close', () => {
        video.remove();
    });

    peers[userId] = call;
}

function addVideoStream(video, stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });

    videoGrid.append(video);
}