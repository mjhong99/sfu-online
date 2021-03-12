// access the video and audio

const videoGrid = document.getElementById('video-grid'); //gets videogrid 

const myVideo = document.createElement('video'); // creates a html document of type video element
myVideo.muted = true; 


//import socket.io
const socket = io('/')
//creating new peer, from peer.js website
var peer = new Peer(undefined, {
	path: '/peerjs', // we got this from server.js
	host: '/', // can be localhost, heroku, what we are hosting
	port: '443' // 3030 since server is on 3030 , for heroku 443?
}); 
// variable for video
let myVideoStream; 

navigator.mediaDevices.getUserMedia({ // built in function that accesses browser for video and audio
	// this function accepts an object
	video: true, // object
	audio: true

}).then(stream =>{ //this means we will have access to video and audio, sort of like a promise, if you call function, it will do this in the future
	myVideoStream = stream;
	addVideoStream(myVideo, stream);// calls addVideoStream

	peer.on('call', call => {
	call.answer(stream); // answer the call from someone elses (p2) refer to func connectToNewUser below
	const video =document.createElement('video'); // this variable creates the video
	call.on('stream',userVideoStream => { // when we recieve someone else's stream (p2), we add video stream to ours
		addVideoStream(video, userVideoStream);
	})

	// the peer.on section is about when the user calls us, we answer the call from the user and add it to video stream

	})

	socket.on('user-connected', (userId)=>{
		connecToNewUser(userId, stream); // goes to connectToNewUser function
	})
	// send message
	let text = $('input'); // get data from input in room ejs

	$('html').keydown((e) =>{ //calling the html file (ejs), the $ is jQuery
		// e represents the event of typing on the keyboard
		if(e.which == 13 && text.val().length != 0){ // enter on your keyboard represents 13, check if we dont want empty text
			console.log(text.val()); // prints message out, the .val function gets input
			socket.emit('message',text.val()); // socket.emit is send, socket.on is receive, we are sending value of input(msg)
			text.val(''); // clearing input after sending message
		}
	}); 

	// receive message
	socket.on('createMessage', message =>{ 
		// use jquery ($) to get access to ul in room.ejs (<ul class="messages"></ul>)
		$('.messages').append(`<li class ="message"><b>user</b></br>${message} </li>`) // append message from parameter
		// the message will have class = "message" and it will have a user above the message
		scrollToBottom(); // calls scroll to bottom function
	})

}) 


// implementation of joining room, automatically generates id
peer.on('open',id =>{ // when I get an id, print id
	socket.emit('join-room',ROOM_ID, id);  // got this ROOM_ID from room.ejs
}) 



const connecToNewUser = (userId, stream) => {
	const call = peer.call(userId, stream); //call someone else's user (p2), send (p2) our stream
	const video = document.createElement('video'); //create a new video element for someone else (p2)
	call.on('stream', userVideoStream => {   // when we recieve someone else's stream (p2), we add video stream to ours
		addVideoStream(video, userVideoStream)
	})
}


// a variable that takes a function with object video, and function stream
const addVideoStream = (video, stream) =>{
	video.srcObject = stream; // returns the object of stream
	video.addEventListener('loadedmetadata', ()=>{ //loadmetadata is an event listener, loads media
		video.play(); // play this video
	})
	videoGrid.append(video); // attach object variable video into videoGrid, video will appear in grid

}
 


// scroll button for chat
const scrollToBottom = () =>{
	let mov = $('main_chat_window'); 
	mov.scrollTop(mov.prop("scrollHeight")); // takes the main chat window and applies the scroll feature.
}

// mute our video
// has to be named enabled otherwise it won't work?
const muteUnmute = () => {
	const enabled = myVideoStream.getAudioTracks()[0].enabled; // gets sound
	if(enabled){ // if there is sound, make it false
		myVideoStream.getAudioTracks()[0].enabled = false; // gets audio track from built in getAudioTracks func
		setUnmuteButton(); 
	} else{
		setMuteButton(); // if no sound, make it true
		myVideoStream.getAudioTracks()[0].enabled = true;
	}

}

const setMuteButton = () =>{
	const html = `
	<i class="fas fa-microphone"></i>  
	<span>Mute</span>
	`
	// sets mute button by changing the image icon
	document.querySelector('.main_mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
	// the class unmute below controls color of icon
	const html = `
	<i class="unmute fas fa-microphone-slash"></i>
	<span>Unmute</span>
	`
	document.querySelector('.main_mute_button').innerHTML = html;
}

// stop our video

const playStop = () =>{
	// confused but let has be named enabled otherwise the feature wont work
	let enabled = myVideoStream.getVideoTracks()[0].enabled; 
	if(enabled){ // if there is video, make it false
		myVideoStream.getVideoTracks()[0].enabled = false;
		setPlayVideo();
	} else{
		setStopVideo(); // if no video, make video play
		myVideoStream.getVideoTracks()[0].enabled = true;
	}
}


const setStopVideo = () =>{
	const html = `
	<i class="fas fa-video"></i>
	<span>Stop Video</span> 
	`
	document.querySelector('.main_video_button').innerHTML = html;
}

const setPlayVideo = () => {
	// the class stop below controls color of video icon
	const html = `
	<i class="stop fas fa-video-slash"></i>
	<span>Turn on Video</span>
	`
	document.querySelector('.main_video_button').innerHTML = html;
}
// in room.ejs, we add video.grid to make a video screen