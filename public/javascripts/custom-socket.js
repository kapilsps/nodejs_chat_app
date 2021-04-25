const socket = io();
const videoGrid = document.getElementById("video-grid");
const peers = {};
const myPeer = new Peer();
const inputMessage = document.getElementById("input-message");
const myVideo = document.createElement("video");
myVideo.muted = true;
let myVideoStream;
let screenShareStream;
let myuserId;

/**show chat box */
$("#chat-button").click(function () {
  $("#chat").toggle();
  $("#participants").toggle();
});
/**end chat box */

/**paticipants box */
$("#participants-button").click(function () {
  $("#participants").toggle();
  $("#chat").toggle();
});
/**end of participants box */

/**audio */
$("#mute-button").click(function () {
  $(this).toggle();
  $("#unmute-button").toggle();
  muteUnmute();
});

$("#unmute-button").click(function () {
  $(this).toggle();
  $("#mute-button").toggle();
  muteUnmute();
});

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};
/**end audio */

/**video */
$("#stop-video-button").click(function () {
  $(this).toggle();
  $("#play-video-button").toggle();
  playStop();
});

$("#play-video-button").click(function () {
  $(this).toggle();
  $("#stop-video-button").toggle();
  playStop();
});

const playStop = () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

/**end video */

/** chat message start */
document.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    socket.emit("message", inputMessage.value, USER_NAME);
    inputMessage.value = "";
  }
});

socket.on("createMessage", (data) => {
  $("#message-window").append(
    "<li><b>" + data.username + "</b>:  " + data.msg + "</li>"
  );
  $("#message-window").scrollTop($("#message-window").prop("scrollHeight"));
});

/**chat message end */

/**get user audio and video */
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
  })
  .catch((err) => {
    console.log(err);
  });
/**end of user audio video */

/**on call by other user */
myPeer.on("call", (call) => {
  peers[call.peer] = call;
  call.answer(myVideoStream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
});
/**end */

/**on user connected share our stream */
socket.on("user-connected", (userId) => {
    if(screenShareStream){
        connectToNewUser(userId, screenShareStream);
    }else{
        connectToNewUser(userId, myVideoStream);
    }
});
/**end */


/**screen share */
$("#present-screen-button").click(() => {
  navigator.mediaDevices
    .getDisplayMedia({ video: true, cursor: true })
    .then((stream) => {
      screenShareStream = stream;

      addVideoStream(myVideo, stream);

      $("#present-screen-button").toggle();
      $("#stop-screen-button").toggle();
      
      changeStreams(screenShareStream);

      screenShareStream.getVideoTracks()[0].onended = function () {
        changeStreams(myVideoStream);
        addVideoStream(myVideo, myVideoStream);
        $("#present-screen-button").toggle();
        $("#stop-screen-button").toggle();
      };

    })
    .catch((e) => {
      console.log(e);
    });
});

$("#stop-screen-button").click(() => {
  screenShareStream.getVideoTracks()[0].stop();
  changeStreams(myVideoStream);
  addVideoStream(myVideo, myVideoStream);
  $("#present-screen-button").toggle();
  $("#stop-screen-button").toggle();
});

/**end of screen share */

/** join room */
myPeer.on("open", (id) => {
  myuserId = id;
  socket.emit("join-room", ROOM_ID, id, USER_NAME);
});

/**end of room */

/**user connected and disconneted */

socket.on("user-disconnected", (data) => {
  if (peers[data.userId]) {
    peers[data.userId].close();
  }

  $("#participants-list li").remove();
  data.users.forEach((element) => {
    if (element.roomId == ROOM_ID) {
      $("#participants-list").append(`<li>${element.name}</li>`);
    }
  });
});

/**user connected and disconneted end */

/**user add */
socket.on("addParticipants", (data) => {
  $("#participants-list li").remove();
  data.forEach((element) => {
    if (element.roomId == ROOM_ID) {
      $("#participants-list").append(`<li>${element.name}</li>`);
    }
  });
});
/**end of user add */

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });

  call.on("close", () => {
    video.remove();
  });

  call.on('error', (err) => {
    console.log(err);
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  videoGrid.append(video);
}

function copyRoomId() {
  /* Get the text field */
  var copyText = document.getElementById("roomIdInput");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */
  alert("Copied the roomId: " + copyText.value);
}


function changeStreams(stream) {
  for(const item in peers){
    peers[item].peerConnection.getSenders().forEach((element) => {
          if(element.track.kind == 'video'){
            element.replaceTrack(stream.getVideoTracks()[0]);
          }
    });
  }
}
