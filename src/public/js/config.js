const accessCode = document.getElementById('accessCode');
const adminCode = document.getElementById('adminCode');
const save = document.getElementById('save');

const socket = io();

// Makes a post request to the server to update the config file
save.addEventListener('click', async () => {
    // Make post req to /config with the access code and admin code as the body
    const response = await fetch('/config', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            accessCode: accessCode.value,
            adminCode: adminCode.value,
        }),
    });

    // Route the user to the home page if the response was okay
    if (response.ok) {
        window.location = '/';
    } else {
        const error = await response.json();
        const notification = new Notification(error, 'red');
        notification.show();
    }
});

function reloadResets() {
    const committees = document.querySelectorAll('.config-committee');

    for (const committee of committees) {
        const locked = committee.querySelector('.locked');
        const unlocked = committee.querySelector('.unlocked');

        locked.addEventListener('click', () => {
            locked.style.display = 'none';
            unlocked.style.display = '';

            socket.emit('unlockSession', committee.id);
        });
    }
}

reloadResets();

socket.on('changeSessionModerator', (committee) => {
    const committeeDiv = document.getElementById(committee.id);

    if (committeeDiv) {
        const locked = committeeDiv.querySelector('.locked');
        const unlocked = committeeDiv.querySelector('.unlocked');
        if (committee.sessionModerator) {
            locked.style.display = '';
            unlocked.style.display = 'none';
        } else {
            locked.style.display = 'none';
            unlocked.style.display = '';
        }
    }
});

const committees = document.getElementById('committees');
socket.on('createCommittee', (committee) => {
    let lockedStyle = 'display: none;';
    let unlockedStyle = '';

    if (committee.sessionModerator) {
        lockedStyle = '';
        unlockedStyle = 'display: none;';
    }

    instantiate('committee', committees, {
        committee: { id: committee.id },
        locked: { style: lockedStyle },
        unlocked: { style: unlockedStyle },
    }, {
        name: { textContent: committee.name },
    });

    reloadResets();
});

socket.on('editCommittee', (committee) => {
    const committeeDiv = document.getElementById(committee.id);

    if (committeeDiv) {
        const text = committeeDiv.querySelector('.config-text');
        text.textContent = committee.name;
    }
});

socket.on('deleteCommittee', (id) => {
    document.getElementById(id).remove();
});

socket.on('deleteAllCommittees', () => {
    committees.innerHTML = '';
});