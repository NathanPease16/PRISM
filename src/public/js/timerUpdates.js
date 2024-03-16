const socket = io();

socket.on('timer', (msg) => {
    console.log(msg);
});