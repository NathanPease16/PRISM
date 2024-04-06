const accessCode = document.getElementById('accessCode');
const adminCode = document.getElementById('adminCode');
const save = document.getElementById('save');

save.addEventListener('click', async () => {
    const response = await fetch('/config', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            accessCode: accessCode.value,
            adminCode: adminCode.value,
        }),
    });

    if (response.ok) {
        window.location = '/';
    } else {
        const error = await response.json();
        const notification = new Notification(error, 'red');
        notification.show();
    }
});