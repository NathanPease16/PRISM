const committeeContainer = document.getElementById('committee-container');

socket.on('createCommittee', (committee) => {
    let sessionStyle = '';
    let lockStyle = 'display: none;';

    if (committee.sessionModerator) {
        sessionStyle = 'display: none;';
        lockStyle = '';
    }

    instantiate('committee', committeeContainer, {
        committee: { id: `committee-${committee.id}` },
        session: { href: `/session/${committee.id}`, style: sessionStyle },
        lock: { style: lockStyle },
        status: { href: `/status/${committee.id}` },
        edit: { href:`/edit/${committee.id}` },
        delete: { id: committee.id, name: committee.name },
    }, {
        name: { innerHTML: committee.name },
    });

    refreshDelete();
});

socket.on('editCommittee', (committee) => {
    const committeeDiv = document.getElementById(`committee-${committee.id}`);

    if (committeeDiv) {
        const text = committeeDiv.querySelector('.committee-text');
        text.textContent = committee.name;
    }
});

socket.on('changeSessionModerator', (committee) => {
    const committeeDiv = document.getElementById(`committee-${committee.id}`);

    if (committeeDiv) {
        const session = committeeDiv.querySelector('.committee-session');
        const lock = committeeDiv.querySelector('.committee-lock');

        if (committee.sessionModerator) {
            session.style.display = 'none';
            lock.style.display = '';
        } else {
            session.style.display = '';
            lock.style.display = 'none';
        }
    }
});