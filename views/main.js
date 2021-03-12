const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector('.chat-messages');
const socket = io();

//get username and room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//message joining chatroom
socket.emit('joinRoom', {username, room});

//message from server
socket.on('message', message =>{
    //log and displays message
    console.log(message);
    outputMessages(message);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //gets the message
    const msg = e.target.elements.msg.value;

    //emits message to server
    socket.emit('chatMessage', msg);

    //scrolls down
    chatMessages.scrollTop = chatMessages.scrollHeight;

    //clear after send and focsuses (selector on) textbox
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//output message to DOM
function outputMessages(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = '<p class="meta">' + message.username + ' <span>' + message.time + ' </span></p>\n<p class="text">\n' + message.text + '\n</p>';
    document.querySelector('.chat-messages').appendChild(div);
}