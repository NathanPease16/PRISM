const Committee = require('../models/committee');
const cookie = require('cookie');


function establishSockets(app) {
    // Create a server for socket connections
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);

    let socketInUse = false;

    // Establish socket connection
    io.on('connection', async (socket) => {
        socket.on('sessionUpdate', (msg) => {
            io.emit('sessionUpdate', msg);
        });

        socket.on('createCommittee', (committee) => {
            io.emit('createCommittee', committee);
        });

        socket.on('editCommittee', (committee) => {
            io.emit('editCommittee', committee);
        });

        socket.on('deleteCommittee', (id) => {
            io.emit('deleteCommittee', id);
        });

        socket.on('deleteAllCommittees', () => {
            io.emit('deleteAllCommittees');
        });

        socket.on('unlockSession', (id) => {
            io.emit('unlockSession', id);

            const removeOldSessionModerator = async () => {
                if (socketInUse) {
                    setTimeout(removeOldSessionModerator, 100);
                } else {
                    socketInUse = true;

                    const committee = await Committee.findOne({ id }).exec();

                    if (committee) {
                        committee.sessionModerator = '';
                        committee.currentAction = { type: 'Out of Session' };
                        await committee.save();

                        io.emit('sessionUpdate', { updateType: 'action', id: committee.id, type: 'Out of Session' });
                        io.emit('changeSessionModerator', committee);
                    }

                    socketInUse = false;
                }
            }

            removeOldSessionModerator();
        });

        const splitRoute = socket.handshake.headers.referer.split('/');
        socket.inSession = splitRoute.length >= 4 && splitRoute[3] === 'session';

        if (socket.handshake.headers.cookie) {
            const cookies = cookie.parse(socket.handshake.headers.cookie);

            socket.sessionModerator = `${cookies.firstName}.${cookies.lastName}`;
        }

        if (socket.inSession) {
            const setSessionModerator = async () => {
                if (socketInUse) {
                    setTimeout(setSessionModerator, 100);
                } else {                    
                    socketInUse = true;
                    const id = splitRoute[4];
                    socket.id = id;

                    const committee = await Committee.findOne({ id }).exec();

                    if (!committee) {
                        return;
                    }


                    committee.sessionModerator = socket.sessionModerator;
                    await committee.save();
                    socketInUse = false;

                    io.emit('sessionUpdate', { updateType: 'moderating', id: committee.id, sessionModerator: socket.sessionModerator });
                    io.emit('changeSessionModerator', committee);
                }
            }

            setSessionModerator();
        }

        socket.on('disconnect', async (reason) => {
            const removeOldSessionModerator = async () => {
                if (socketInUse) {
                    setTimeout(removeOldSessionModerator, 100);
                } else {
                    socketInUse = true;

                    if (!socket.inSession) {
                        return;
                    }

                    const committee = await Committee.findOne({ id: socket.id }).exec();

                    if (committee) {
                        committee.sessionModerator = '';
                        committee.currentAction = { type: 'Out of Session' };
                        await committee.save();

                        io.emit('sessionUpdate', { updateType: 'action', id: committee.id, type: 'Out of Session' });
                        io.emit('changeSessionModerator', committee);
                    }

                    socketInUse = false;
                }
            }

            if (socket.inSession) {
                removeOldSessionModerator();
            }
        });
    });

    return server;
}

module.exports = establishSockets;