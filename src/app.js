// Import needed modules
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const db = require('./server/scripts/db');
const path = require('path');

// Create the app and establish a port
const app = express();
const PORT = 8080;

dotenv.config({ path: '.env'});
db(process.env.MONGO_URI);

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

app.use('/global', express.static(path.join(__dirname, 'global')));

// Give the app the ability to parse body data
app.use(bodyParser.json());
app.use(cookieParser());

// If config isn't setup, force all to reroute to config
app.use(require('./server/scripts/config'));

app.use(require('./server/scripts/auth'));

// Give the app the get routers
app.use(require('./server/routes/get/committeeRouter.js'));
app.use(require('./server/routes/get/sessionRouter.js'));
app.use(require('./server/routes/get/authRouter.js'));
app.use(require('./server/routes/get/getRouter.js'));
app.use(require('./server/routes/get/badGatewayRouter.js'));

app.use(require('./server/routes/post/authRouter.js'));
app.use(require('./server/routes/post/committeeRouter.js'));
app.use(require('./server/routes/post/postRouter.js'));
app.use(require('./server/routes/post/sessionRouter.js'));


// Establish socket connection
io.on('connection', (socket) => {
    // Emit the timer message to all clients
    socket.on('timer', (msg) => {
        io.emit('timer', msg);
    });

    socket.on('sessionUpdate', (msg) => {
        io.emit('sessionUpdate', msg);
    });

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