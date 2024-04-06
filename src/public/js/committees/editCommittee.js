// Buttons for operations
const confirmButton = document.getElementById('confirm');

// Document elements
const nameInput = document.getElementById('name');

const id = nameInput.getAttribute('data-id');

confirmButton.addEventListener('click', async () => {
    // Post to /editCommittee/id with new name as body
    const response = await fetch(`/editCommittee/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nameInput.value }),
    });

    if (response.ok) {
        window.location = '/';
    } else {
        const error = await response.json();
        const notification = new Notification(error, 'red');
        notification.show();
    }
});