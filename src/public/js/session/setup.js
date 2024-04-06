const unselectedCountries = document.getElementById('unselected-countries');
const selectedCountries = document.getElementById('selected-countries');

const countryCount = document.getElementById('country-count');

const clear = document.getElementById('clear');
const setup = document.getElementById('setup');

const countries = committee.countries;
const unCountries = [];

function setCountryCount() {
    if (countries.length == 1) {
        countryCount.textContent = `${countries.length} Country`;
    } else {
        countryCount.textContent = `${countries.length} Countries`;
    }
}

setCountryCount();

(async () => {
    // Get all UN recognized nations
    const response = await fetch('/global/UN_Nations.txt');
    const data = await response.text();

    const countryNames = data.split('\n');

    for (const countryNameSet of countryNames) {
        const country = {};

        const names = countryNameSet.split(' | ');
        country.title = names[0];
        country.code = names[names.length - 2];
        country.flagCode = names[names.length - 1].substring(0, 2);
        country.alternatives = [];
        country.attendance = 'A';

        for (i = 1; i < names.length - 2; i++) {
            country.alternatives.push(names[i]);    
        }

        unCountries.push(country);
    }

    countrySelector(unCountries, countries, 
        { parent: unselectedCountries, sort: true, event: setCountryCount }, 
        { parent: selectedCountries, sort: true, event: setCountryCount });

    setupSearch(unCountries, countries);

    clear.addEventListener('click', () => {
        countries.splice(0, countries.length);
        for (const country of unCountries) {
            document.getElementById(`${country.title}-selected`).style = 'display: none;';
            document.getElementById(`${country.title}-unselected`).style = '';
            countryCount.textContent = '0 Countries';
        }
    });

    setup.addEventListener('click', async () => {
        const response = await fetch(`/setup/${committee.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ countries }),
        });

        if (response.ok) {
            window.location = `/session/${committee.id}`;
        } else {
            const error = await response.json();
            const notification = new Notification(error, 'red');
            notification.show();
        }
    });
})();