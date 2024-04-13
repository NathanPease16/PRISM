const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const accessCode = document.getElementById('accessCode');
const submit = document.getElementById('submit');

// Submit post req to server attempting to do regular
// authorization for a user
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

    // If okay, route the user to where they were
    // trying to route to, or home if it can't be
    // determined
    if (response.ok) {
        const query = window.location.search;
        const urlParams = new URLSearchParams(query);
        const redirect = urlParams.get('redirect');
        if (!redirect) {
            window.location = '/';
        } else {
            window.location = `${redirect}`;
        }
    // Show an error if the post req failed
    } else {
        const error = await response.json();
        const notification = new Notification(error, 'red');
        notification.show();
    }
});