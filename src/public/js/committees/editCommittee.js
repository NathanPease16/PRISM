/**
 * Requests that an edit be made on a specific committee,
 * and then emits a message from a socket alerting all
 * listening clients that an edit was made
 * 
 * @summary Edits the information of a committee
 * 
 * @author Nathan Pease
 */

// Buttons for operations
const confirmButton = document.getElementById('confirm');

// Document elements
const nameInput = document.getElementById('name');

const id = nameInput.getAttribute('data-id');

const editSocket = io();

confirmButton.addEventListener('click', async () => {
    // Post to /editCommittee/id with new name as body
    const response = await fetch(`/editCommittee/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nameInput.value }),
    }); 
    
    // If the response was okay, let all other clients know and send out a 
    // session update (using session/action.js) to alert all those viewing
    // the status of a committee that the name of it changed
    if (response.ok) {
        editSocket.emit('editCommittee', { id, name: nameInput.value });
        sessionUpdate({ updateType: 'name', name: nameInput.value, id });
        window.location = '/';
    // Show an error message if the request to the server failed
    } else {
        const error = await response.json();
        const notification = new Notification(error, 'red');
        notification.show();
    }
});