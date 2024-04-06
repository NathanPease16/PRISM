const allCountries = document.getElementById('all-countries');
const selectedCountriesDiv = document.getElementById('selected-countries');
const countryCount = document.getElementById('country-count');
const search = document.getElementById('search');
const clear = document.getElementById('clear');
const setup = document.getElementById('setup');

const id = window.location.pathname.split('/')[2];

const countries = [];

(async () => {
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

        countries.push(country);
    }

    const loadCountries = (searchValue) => {
        allCountries.innerHTML = '';
        selectedCountriesDiv.innerHTML = '';

        if (selectedCountries.length == 1) {
            countryCount.textContent = `${selectedCountries.length} Country`;
        } else {
            countryCount.textContent = `${selectedCountries.length} Countries`;
        }

        loop: for (const country of countries) {
            const addCountry = (eventListener, appendTo) => {
                const div = document.createElement('div');
                div.className = 'country';

                const p = document.createElement('p');
                p.textContent = country.title;

                const img = document.createElement('img');
                img.src = `/global/flags/${country.flagCode.toLowerCase()}.png`;

                div.appendChild(img);
                div.appendChild(p);

                div.addEventListener('click', eventListener);

                appendTo.append(div);
            }

            for (const selectedCountry of selectedCountries) {
                if (selectedCountry.title == country.title) {
                    addCountry(() => {
                        selectedCountries = selectedCountries.filter((c) => c.title != country.title);
                        loadCountries('');
                    }, selectedCountriesDiv);
    
                    continue loop;
                }
            }

            const allCountriesEvent = () => {
                selectedCountries.push(country);
                loadCountries('');
            }
            
            if (country.title.toLowerCase().startsWith(searchValue.toLowerCase()) || country.code.startsWith(searchValue)) {
                addCountry(allCountriesEvent, allCountries);
                continue;
            }

            for (alternative of country.alternatives) {
                if (alternative.toLowerCase().startsWith(searchValue.toLowerCase())) {
                    addCountry(allCountriesEvent, allCountries);
                    continue loop;
                }
            }
        }
    }

    loadCountries('');

    search.addEventListener('input', () => {
        loadCountries(search.value);
    });

    clear.addEventListener('click', () => {
        selectedCountries = [];
        loadCountries('');
    });

    setup.addEventListener('click', async () => {
        const response = await fetch(`/setup/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id, selectedCountries}),
        });

        if (response.ok) {
            window.location = `/session/${id}`;
        } else {
            const error = await response.json();
            const notification = new Notification(error, 'red');
            notification.show();
        }
    });
})();