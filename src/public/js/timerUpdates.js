// Test file for timers/sockets
const socket = io();

socket.on('timer', (msg) => {
    console.log(msg);
});