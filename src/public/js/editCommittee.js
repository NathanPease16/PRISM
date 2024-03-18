// Buttons for operations
const confirmButton = document.getElementById('confirm');
const cancelButton = document.getElementById('cancel');

// Document elements
const nameInput = document.getElementById('name');
const error = document.getElementById('error');

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
        error.style = 'display: block;';
    }
});

// Route to index, no post req
cancelButton.addEventListener('click', () => {
    window.location = '/';
});