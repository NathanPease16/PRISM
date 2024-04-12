const Committee = require('../models/committee');
const cookie = require('cookie');


function establishSockets(app) {
    // Create a server for socket connections
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);

    // To ensure no race conditions (especially with connecting and disconnecting)
    let socketInUse = false;
    
    // To ensure ALL versions of a socket in a session have disconnected
    const sockets = [];

    // Establish socket connection
    io.on('connection', async (socket) => {
        // Add the socket to the list of sockets
        sockets.push(socket);

        // Split the route and determine if the connected socket is a 
        // session socket or not (a socket on a page that is related to a 
        // specific instance of a session, meaning it requires locking and
        // unlocking)
        const splitRoute = socket.handshake.headers.referer.split('/');
        socket.inSession = splitRoute.length >= 4 && splitRoute[3] === 'session';

        // If there are cookies, find the first and last name and set them as
        // the socket's session moderator
        if (socket.handshake.headers.cookie) {
            const cookies = cookie.parse(socket.handshake.headers.cookie);

            socket.sessionModerator = `${cookies.firstName}.${cookies.lastName}`;
        }

        // Check if the socket is in session
        if (socket.inSession) {
            const setSessionModerator = async () => {
                // If the socket is in use, try again in 100ms
                if (socketInUse) {
                    setTimeout(setSessionModerator, 100);
                } else {                
                    // Lock the socket    
                    socketInUse = true;

                    // Get the ID from the session route and assign it to the socket's id
                    const id = splitRoute[4];
                    socket.id = id;

                    const committee = await Committee.findOne({ id }).exec();

                    // If the committee can't be found, just return as nothing can be locked
                    if (!committee) {
                        return;
                    }

                    // Set the committee's session moderator to the socket's session moderator
                    // and save it to the database
                    committee.sessionModerator = socket.sessionModerator;
                    await committee.save();
                    socketInUse = false;

                    // Tell clients there was a session update and change in session moderator
                    io.emit('sessionUpdate', { updateType: 'moderating', id: committee.id, sessionModerator: socket.sessionModerator });
                    io.emit('changeSessionModerator', committee);
                }
            }

            setSessionModerator();
        }

        // Send the message that there was a session update back to all clients listening
        socket.on('sessionUpdate', (msg) => {
            io.emit('sessionUpdate', msg);
        });

        // Tell each listening client there was a new committee created
        socket.on('createCommittee', (committee) => {
            io.emit('createCommittee', committee);
        });

        // Tell listening clients a committee was edited
        socket.on('editCommittee', (committee) => {
            io.emit('editCommittee', committee);
        });

        // Tell listening clients a committee was deleted
        socket.on('deleteCommittee', (id) => {
            io.emit('deleteCommittee', id);
        });

        // Tell listening clients all committees were deleted
        socket.on('deleteAllCommittees', () => {
            io.emit('deleteAllCommittees');
        });

        // Removes old session moderators based on a given ID
        // This function is the main reason why socketInUse is required.
        // socketInuse acts as a lock for a potential race condition that
        // occurs when a session moderator is removed. In the event that
        // someone in a session reloads their page, this will cause 
        // both the 'disconnect' and 'connect' even to occur, as refreshing
        // the page causes a disconnect, and loading it again causes a connect
        // event. However, these events act on separate threads, meaning it 
        // is possible for the connect event to finish before the disconnect even,
        // meaning the wrong session moderator will be stored in the database,
        // messing with the session's lock status. By using socketInUse, each
        // event is forced to wait until the socketInUse variable is false before
        // it can attempt its operation
        const removeOldSessionModerator = async (id) => {
            // If the socket is currently in use, try again in 100ms
            if (socketInUse) {
                setTimeout(removeOldSessionModerator, 100);
            } else {
                // Lock the socket so no one else can use it
                socketInUse = true;

                // Find the committee to unlock
                const committee = await Committee.findOne({ id }).exec();

                // Reset the session moderator and current action
                if (committee) {
                    committee.sessionModerator = '';
                    committee.currentAction = { type: 'Out of Session' };
                    await committee.save();

                    // Tell clients there was a session update and a 
                    // change to the session moderator
                    io.emit('sessionUpdate', { updateType: 'action', id: committee.id, type: 'Out of Session' });
                    io.emit('changeSessionModerator', committee);
                }

                // Unlock the socket so it can be used again
                socketInUse = false;
            }
        }

        // Tell clients a session was unlocked AND unlock the session
        socket.on('unlockSession', (id) => {
            io.emit('unlockSession', id);

            removeOldSessionModerator(id);
        });

        // Triggered whenever a socket disconnects, whether it be because
        // of lost internet, a reloaded page, closed tab, crashed browser,
        // turned off computer, etc.
        socket.on('disconnect', async (reason) => {
            // Loop through all sockets to see if they have the same ID but are physically
            // different sockets. If this is the case, then that means there are multiple sockets
            // connected to just one instance of a session. A session should not be unlocked 
            // until all instances of the session are closed, so if two are found to have
            // the same ID nothing should be done
            for (const s of sockets) {
                if (s.id == socket.id && s != socket) {
                    // Remove the socket from the list
                    sockets.splice(sockets.indexOf(socket), 1);
                    return;
                }
            }

            // If there is only one socket with ID of the socket that disconnected, then the
            // committee can be safely unlocked
            if (socket.inSession) {
                removeOldSessionModerator(socket.id);
            }

            // Remove the old socket from the list of sockets
            sockets.splice(sockets.indexOf(socket), 1);
        });
    });

    return server;
}

module.exports = establishSockets;