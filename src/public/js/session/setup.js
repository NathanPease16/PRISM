const unselectedCountries = document.getElementById('unselected-countries');
const selectedCountries = document.getElementById('selected-countries');

const custom = document.getElementById('custom');

const countryCount = document.getElementById('country-count');

const clear = document.getElementById('clear');
const setup = document.getElementById('setup');

const countries = committee.countries;
let unCountries = [];

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

    // Filter out countries that have already been selected
    unCountries = unCountries.filter((country) => {
        for (const selected of countries) {
            if (selected.title == country.title) {
                return false;
            }
        }
        return true;
    });

    console.log(unCountries);

    const sort = (a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (titleA > titleB) {
            return 1;
        } else if (titleA < titleB) {
            return -1;
        } else {
            return 0;
        }
    }

    const unselected = {
        countries: unCountries,
        parent: unselectedCountries,
        sort,
        afterEvent: setCountryCount,
    }

    const selected = {
        countries,
        parent: selectedCountries,
        sort,
        afterEvent: setCountryCount,
    }

    const countrySelector = new CountrySelector('setup', unselected, selected);
    countrySelector.render();

    custom.addEventListener('click', () => {
        const popup = new Popup();
        
        popup.addSmallHeader('Custom');
        const name = popup.addInput('Name');
        
        popup.addButton('Submit', 'blue', () => {
            const country = {};

            country.title = name.value;
            country.code = '';
            country.flagCode = 'xx';
            country.alternatives = [];
            country.attendance = 'A';

            countrySelector.add(country, true);

            document.getElementById(`${country.title}-setup-selected`).addEventListener('click', () => {
                countrySelector.remove(country);
            });

            popup.remove();
        });

        popup.addButton('Cancel', 'red', () => {
            popup.remove();
        });

        popup.show();
    });

    setupSearch('setup');

    clear.addEventListener('click', () => {
        countrySelector.clear();
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
            sessionUpdate({ updateType: 'attendance', countries, id: committee.id });
            window.location = `/session/${committee.id}`;
        } else {
            const error = await response.json();
            const notification = new Notification(error, 'red');
            notification.show();
        }
    });
})();

const action = {
    id: committee.id,
    type: 'setup',
}

setCurrentAction(action);