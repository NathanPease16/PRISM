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

    // Tell the server a committee was created and
    // route the user back to the home page
    if (response.ok) {
        const committee = await response.json();
        socket.emit('createCommittee', committee)
        window.location = '/';
    } else {
        // Show error if failed
        const error = await response.json();
        const notification = new Notification(error, 'red');
        notification.show();
    }
});