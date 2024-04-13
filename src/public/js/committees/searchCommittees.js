const searchbar = document.getElementById('search');
const committees = document.querySelectorAll('.committee');

// Search through all committees and hide the ones that don't match the given
// search parameters
searchbar.addEventListener('input', () => {
    for (const committee of committees) {
        if (!committee.getAttribute('data-name').toLowerCase().startsWith(searchbar.value.toLowerCase())) {
            committee.style = 'display: none;';
        } else {
            committee.style = '';
        }
    }
});