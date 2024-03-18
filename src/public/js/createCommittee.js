// Get elements from document
const nameInput = document.getElementById('name');
const submit = document.getElementById('create');
const error = document.getElementById('error');

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
        window.location = '/';
    } else {
        // Show error if failed (needs to be updated to discern error types)
        error.style = 'display: block;';
    }
});