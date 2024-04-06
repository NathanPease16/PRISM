const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const accessCode = document.getElementById('accessCode');
const submit = document.getElementById('submit');

submit.addEventListener('click', async () => {
    const response = await fetch('/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            accessCode: accessCode.value,
            firstName: firstName.value,
            lastName: lastName.value,
        }),
    });

    if (response.ok) {
        const query = window.location.search;
        const urlParams = new URLSearchParams(query);
        const redirect = urlParams.get('redirect');
        if (!redirect) {
            window.location = '/';
        } else {
            window.location = `${redirect}`;
        }
    } else {
        const error = await response.json();
        const notification = new Notification(error, 'red');
        notification.show();
    }
});