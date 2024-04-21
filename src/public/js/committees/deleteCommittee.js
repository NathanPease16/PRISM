/**
 * Submits a request to the server for a committee to be
 * deleted, and then emits a message from a socket to
 * alert all other clients that a committee was deleted
 * 
 * @summary Submits a request for the deletion of a committee
 * 
 * @author Nathan Pease
 */

const deleteAll = document.getElementById('delete-all');

const socket = io();

/**
 * Deletes the committee that matches the given ID
 * @param {*} id The ID of the committee to delete
 */
const removeOne = (id) => {
    const committee = document.getElementById(`committee-${id}`);

    // Remove the committee from the document
    if (committee) {
        committee.remove();
    }
}

/**
 * Removes all committees from the document
 */
const removeAll = () => {
    const committees = document.querySelectorAll('.committee-card');

    for (const committee of committees) {
        committee.remove();
    }
}

/**
 * Reloads all of the delete buttons, meaning if a new committee is added at runtime
 * its delete button will function properly
 */
function refreshDelete() {
    const deleteButtons = document.querySelectorAll('.committee-delete');

    // Loop through all delete buttons and add an event listener that shows a popup
    // asking if they're sure they want to delete the committee
    for (const button of deleteButtons) {
        button.addEventListener('click', () => {
            const warning = new Popup();

            warning.addSmallHeader('Warning!');
            warning.addText(`Are you sure you want to delete '${button.name}'? This is a dangerous operation that CANNOT be undone`);
            
            // Add a confirm button that, when pressed, sends a request
            // to the server for the committee to be deleted
            warning.addButton('Confirm', 'red', async () => {
                const response = await fetch(`/deleteCommittee/${button.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // Remove from the document and tell all other
                // instances that a committee was deleted
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

// Removes all committees from the document
deleteAll.addEventListener('click', () => {
    const warning = new Popup();

    warning.addSmallHeader('Warning!');
    warning.addText(`Are you sure you want to delete ALL committees? This is an EXTREMELY dangerous operation that CANNOT be undone`);
    
    // Make a request to the server to delete all committees
    warning.addButton('Confirm', 'red', async () => {
        const response = await fetch(`/deleteAllCommittees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            // Remove all committees from the document and alert all other clients
            removeAll();
            socket.emit('deleteAllCommittees');
        } else {
            new Notification('You are not authorized for this action', 'red').show();
        }

        warning.remove();
    });

    warning.addButton('Cancel', 'blue', () => {
        warning.remove();
    });

    warning.show();
});

// When a delete message is received, remove the specified committee
socket.on('deleteCommittee', (id) => {
    removeOne(id);
});

// If a delete all message is received, delete all
socket.on('deleteAllCommittees', () => {
    removeAll();
});