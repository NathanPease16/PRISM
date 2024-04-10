let lastAction;

async function setCurrentAction(action) {
    action.actionTime = Date.now();

    const response = await fetch(`/action/${action.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({action}),
    });

    if (response.ok) {
        console.log('Successfully updated action');
    } else {
        console.log('Failed to update action');
    }

    lastAction = action;
}

function getLastAction() {
    return lastAction;
}