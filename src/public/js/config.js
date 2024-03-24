const accessCode = document.getElementById('accessCode');
const adminCode = document.getElementById('adminCode');
const save = document.getElementById('save');

save.addEventListener('click', async () => {
    if (!accessCode.value || !adminCode.value) {
        console.log('Failed to save');
    }

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
        console.log('Failed');
    }
});