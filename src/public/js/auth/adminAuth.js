const adminCode = document.getElementById('adminCode');
const submit = document.getElementById('submit');

// Send post req to server, attempting to authorize the user
submit.addEventListener('click', async () => {
    const response = await fetch('/adminAuth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            adminCode: adminCode.value,
        }),
    });

    // If the response was okay, route the user to whatever
    // page they were originally trying to access by checking
    // the value of ?redirect=..., or if ?redirect doesn't have
    // a value routing them to the home page
    if (response.ok) {
        const query = window.location.search;
        const urlParams = new URLSearchParams(query);
        const redirect = urlParams.get('redirect');
        if (!redirect) {
            window.location = '/';
        } else {
            window.location = `${redirect}`;
        }
    // Display an error message if they could not be verified
    } else {
        const error = await response.json();
        const notification = new Notification(error, 'red');
        notification.show();
    }
});