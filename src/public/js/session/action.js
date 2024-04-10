let lastAction;
const socket = io();

function sessionUpdate(update) {
    if (!update.id) {
        update.id = committee.id;
    }
    socket.emit('sessionUpdate', update);
}

async function setCurrentAction(action) {
    action.actionTime = Date.now();
    action.updateType = 'action';

    const response = await fetch(`/action/${action.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({action}),
    });

    if (response.ok) {
        sessionUpdate(action);
    } else {
        console.log('Failed to update action');
    }

    lastAction = action;
}

function getLastAction() {
    return lastAction;
}