const socket = io();

function sessionUpdate(update) {
    socket.emit('sessionUpdate', update);
}

async function setCurrentAction(action) {
    if (!action.id) {
        action.id = committee.id;
    }

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
}