const deleteAll = document.getElementById('delete-all');

const socket = io();

const removeOne = (id) => {
    const committee = document.getElementById(`committee-${id}`);

    if (committee) {
        committee.remove();
    }
}

const removeAll = () => {
    const committees = document.querySelectorAll('.committee');

    for (const committee of committees) {
        committee.remove();
    }
}

function refreshDelete() {
    const deleteButtons = document.querySelectorAll('.committee-delete');
    for (const button of deleteButtons) {
        button.addEventListener('click', () => {
            console.log('HELLO');
            const warning = new Popup();

            warning.addSmallHeader('Warning!');
            warning.addText(`Are you sure you want to delete '${button.name}'? This is a dangerous operation that CANNOT be undone`);
            
            warning.addButton('Confirm', 'red', async () => {
                const response = await fetch(`/deleteCommittee/${button.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                removeOne(button.id);
                socket.emit('deleteCommittee', button.id);

                warning.remove();
            });

            warning.addButton('Cancel', 'blue', () => {
                warning.remove();
            });

            warning.show();
        });
    }
}

refreshDelete();

deleteAll.addEventListener('click', () => {
    const warning = new Popup();

    warning.addSmallHeader('Warning!');
    warning.addText(`Are you sure you want to delete ALL committees? This is an EXTREMELY dangerous operation that CANNOT be undone`);
            
    warning.addButton('Confirm', 'red', async () => {
        const response = await fetch(`/deleteAllCommittees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        removeAll();
        socket.emit('deleteAllCommittees');

        warning.remove();
    });

    warning.addButton('Cancel', 'blue', () => {
        warning.remove();
    });

    warning.show();
});

socket.on('deleteCommittee', (id) => {
    removeOne(id);
});

socket.on('deleteAllCommittees', () => {
    removeAll();
});