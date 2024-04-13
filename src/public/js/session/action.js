const socket = io();

/**
 * Sends out an update to all clients viewing the status of a committee's session
 * that something changed (such as entering voting, unmod, etc.)
 * @param {*} update The update made to a session
 */
function sessionUpdate(update) {
    // Assign it an id if it doesn't have one
    if (!update.id) {
        update.id = committee.id;
    }

    // Emit the session update to all clients
    socket.emit('sessionUpdate', update);
}

/**
 * Assigns the current action value in the database, and then
 * emits a session update of type 'action' since an action
 * update occurred
 * @param {*} action The action that was taken
 */
async function setCurrentAction(action) {
    // Assign the action an id if it doesn't have one
    if (!action.id) {
        action.id = committee.id;
    }

    // Set the action time, as well as what kind of update it is
    // (for when it sends out a session update)
    action.actionTime = Date.now();
    action.updateType = 'action';

    // Make a request to the server to update the current action
    const response = await fetch(`/action/${action.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({action}),
    });

    // If the response is okay, send out a session update
    if (response.ok) {
        sessionUpdate(action);
    // If it failed, log the failure (but don't show an error
    // notification, as a consistent failure during a real session
    // could be incredibly disruptive)
    } else {
        console.log('Failed to update action');
    }
}

// If a this committee is unlocked, return back
// to the home page
socket.on('unlockSession', (id) => {
    if (!committee) {
        return;
    }

    if (committee.id == id) {
        window.location = '/';
    }
});