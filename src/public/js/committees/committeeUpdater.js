/**
 * Uses sockets to update the committee page accordingly
 * based on different events, such as when a committee
 * is created or when a session becomes locked/unlocked
 * 
 * @summary Updates the committee page to reflect changes 
 * 
 * @author Nathan Pease
 */

const committeeContainer = document.getElementById('committee-container');

// When a committee is created on someone else's client,
// instantiate a new one on this client
socket.on('createCommittee', (committee) => {
    let sessionStyle = '';
    let lockStyle = 'display: none;';

    if (committee.sessionModerator) {
        sessionStyle = 'display: none;';
        lockStyle = '';
    }   

    // Instantiate a new committee using templates.js
    instantiate('committee', committeeContainer, {
        committee: { id: `committee-${committee.id}` },
        session: { href: `/session/${committee.id}`, style: sessionStyle },
        lock: { style: lockStyle },
        chair: { href: `/char/${committee.id}` },
        status: { href: `/status/${committee.id}` },
        edit: { href:`/edit/${committee.id}` },
        delete: { id: committee.id, name: committee.name },
    }, {
        name: { innerHTML: committee.name },
    });

    // Reload the delete buttons created by deleteCommittee.js to
    // include the new committee
    refreshMenus();
    refreshDelete();
});

// When a committee is edited, find the committee in the document
// and change its name to whatever the edited committee's name
// is now
socket.on('editCommittee', (committee) => {
    const committeeDiv = document.getElementById(`committee-${committee.id}`);

    if (committeeDiv) {
        const text = committeeDiv.querySelector('.committee-card-text');
        text.textContent = committee.name;
    }
});

// Update a committee when there's a change to a session moderator
socket.on('changeSessionModerator', (committee) => {
    const committeeDiv = document.getElementById(`committee-${committee.id}`);

    if (committeeDiv) {
        const session = committeeDiv.querySelector('.committee-session');
        const lock = committeeDiv.querySelector('.committee-lock');

        // If there is a session moderator, lock the committee
        if (committee.sessionModerator) {
            session.style.display = 'none';
            lock.style.display = '';
        // Otherwise leave it unlocked
        } else {
            session.style.display = '';
            lock.style.display = 'none';
        }
    }
});