const nameInput = document.getElementById('name');
const submit = document.getElementById('create');
const error = document.getElementById('error');

submit.addEventListener('click', async () => {
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
        error.style = 'display: block;';
    }
});