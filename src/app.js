/**
 * Creates the base app for the server to run by:
 *  - Importing necessary modules
 *  - Creating the app
 *  - Creating a server with sockets
 *  - Configuring the environment
 *  - Adding the view engine and public routes
 *  - Adding routers
 *  - Starting the server 
 * 
 * @summary Creates the base app for the server to run
 * 
 * @author Nathan Pease
 */

// Import needed modules
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const db = require('./server/scripts/db');
const path = require('path');

require('./server/scripts/logs');

// Create the app and establish a port
const app = express();
const PORT = 8080;

// Create the server from sockets.js is server routes using the express app
const server = require('./server/routes/sockets')(app);

// Configure the dotenv file and setup the database
dotenv.config({ path: '.env'});
db(process.env.MONGO_URI);

// Establish the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set routes to important public files
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));

// Establish a route to global, where flags and UN information can be found
app.use('/global', express.static(path.join(__dirname, 'global')));

// Give the app the ability to parse body data
app.use(bodyParser.json());
app.use(cookieParser());

// If config isn't setup, force all to reroute to config
app.use(require('./server/scripts/config'));

// If config is set up, force all clients to authorize before
// accessing the app
app.use(require('./server/scripts/auth'));

// Give the app the get routers
app.use(require('./server/routes/get/committeeRouter.js'));
app.use(require('./server/routes/get/sessionRouter.js'));
app.use(require('./server/routes/get/authRouter.js'));
app.use(require('./server/routes/get/getRouter.js'));
// This router MUST go last as it assumes control of ALL get routes
// not yet defined
// If a get router is added to the app after this one, it will NOT
// override the bad gateway router, the first route to be added always
// takes priority
app.use(require('./server/routes/get/badGatewayRouter.js'));

// Give the app the post routers
app.use(require('./server/routes/post/authRouter.js'));
app.use(require('./server/routes/post/committeeRouter.js'));
app.use(require('./server/routes/post/postRouter.js'));
app.use(require('./server/routes/post/sessionRouter.js'));

// Start the server
server.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server started successfully`);
    } else {
        console.log(`Server startup failed:\n${error}`);
    }
});

module.exports = app;