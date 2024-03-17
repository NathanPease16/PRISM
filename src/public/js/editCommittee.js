const confirmButton = document.getElementById('confirm');
const cancelButton = document.getElementById('cancel');

const nameInput = document.getElementById('name');

const error = document.getElementById('error');

const id = nameInput.getAttribute('data-id');

confirmButton.addEventListener('click', async () => {
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

cancelButton.addEventListener('click', () => {
    window.location = '/';
});