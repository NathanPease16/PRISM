// Import needed modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const heal = require('./server/scripts/jsonData');

heal();

// Create the app and establish a port
const app = express();
const PORT = 8080;

// Create a server for socket connections
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Establish the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set routes to important public files
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));

// Give the app the ability to parse body data
app.use(bodyParser.json());

// Give the app the routers
app.use(require('./server/routes/router.js'));
app.use(require('./server/routes/internal.js'));

// Establish socket connection
io.on('connection', (socket) => {
    // Emit the timer message to all clients
    socket.on('timer', (msg) => {
        io.emit('timer', msg);
    })

    socket.on('disconnect', () => {
    });
});

// Start the server
server.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server running at http://localhost:${PORT}`);
    } else {
        console.log(`Server startup failed:\n${error}`);
    }
});

module.exports = app;