const adminCode = document.getElementById('adminCode');
const submit = document.getElementById('submit');

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
        console.log('Failed');
    }
});