/**
 * Handles all of the config page, which includes setting the
 * access code and admin code, as well as unlocking committee
 * sessions
 * 
 * @summary Handles all of the config page
 * 
 * @author Nathan Pease
 */

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
        // Display an error notification
        const error = await response.json();
        const notification = new Notification(error, 'red');
        notification.show();
    }
});

/**
 * Loads all the buttons that allow admin's to unlock/reset a committee
 */
function reloadResets() {
    const committees = document.querySelectorAll('.config-committee');

    for (const committee of committees) {
        const locked = committee.querySelector('.locked');
        const unlocked = committee.querySelector('.unlocked');

        // Change the style to be unlocked
        locked.addEventListener('click', () => {
            locked.style.display = 'none';
            unlocked.style.display = '';

            // Send a message to the server saying a committee was unlocked
            socket.emit('unlockSession', committee.id);
        });
    }
}

reloadResets();

// Runs when a session moderator is changed
socket.on('changeSessionModerator', (committee) => {
    const committeeDiv = document.getElementById(committee.id);

    if (committeeDiv) {
        const locked = committeeDiv.querySelector('.locked');
        const unlocked = committeeDiv.querySelector('.unlocked');

        // If there is a session moderator, lock the committee on admin side
        if (committee.sessionModerator) {
            locked.style.display = '';
            unlocked.style.display = 'none';
        // If there isn't a session moderator, unlock the committee on admin side
        } else {
            locked.style.display = 'none';
            unlocked.style.display = '';
        }
    }
});

const committees = document.getElementById('committees');
// Create a new committee when the createCommittee event is received
socket.on('createCommittee', (committee) => {
    let lockedStyle = 'display: none;';
    let unlockedStyle = '';

    if (committee.sessionModerator) {
        lockedStyle = '';
        unlockedStyle = 'display: none;';
    }

    // Instantiate using template.js
    instantiate('committee', committees, {
        committee: { id: committee.id },
        locked: { style: lockedStyle },
        unlocked: { style: unlockedStyle },
    }, {
        name: { textContent: committee.name },
    });

    reloadResets();
});

// When a committee is updated, reload the name of that committee
socket.on('editCommittee', (committee) => {
    const committeeDiv = document.getElementById(committee.id);

    if (committeeDiv) {
        const text = committeeDiv.querySelector('.config-text');
        text.textContent = committee.name;
    }
});

// Remove a committee if it is deleted
socket.on('deleteCommittee', (id) => {
    document.getElementById(id).remove();
});

// Remove all committees
socket.on('deleteAllCommittees', () => {
    committees.innerHTML = '';
});