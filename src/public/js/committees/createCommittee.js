// Get elements from document
const nameInput = document.getElementById('name');
const submit = document.getElementById('create');

socket = io();

submit.addEventListener('click', async () => {
    // Send post req to server at /createCommittee with the input
    // name as the body
    const response = await fetch('/createCommittee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nameInput.value })
    });

    if (response.ok) {
        const committee = await response.json();
        socket.emit('createCommittee', committee)
        window.location = '/';
    } else {
        // Show error if failed (needs to be updated to discern error types)
        const error = await response.json();
        const notification = new Notification(error, 'red');
        notification.show();
    }
});