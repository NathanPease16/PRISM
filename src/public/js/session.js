const allCountries = document.getElementById('all-countries');
const selectedCountriesDiv = document.getElementById('selected-countries');
const countryCount = document.getElementById('country-count');
const search = document.getElementById('search');
const clear =document.getElementById('clear');

const countries = [];
let selectedCountries = [];

(async () => {
    const response = await fetch('/global/UN_Nations.txt');
    const data = await response.text();

    const countryNames = data.split('\n');

    for (const countryNameSet of countryNames) {
        const country = {};

        const names = countryNameSet.split(' | ');
        country.title = names[0];
        country.code = names[names.length - 2];
        country.flagCode = names[names.length - 1];
        country.alternatives = [];

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

            if (selectedCountries.includes(country)) {
                addCountry(() => {
                    selectedCountries = selectedCountries.filter((c) => c != country);
                    loadCountries('');
                }, selectedCountriesDiv);

                continue;
            }

            const allCountriesEvent = () => {
                selectedCountries.push(country);
                loadCountries('');
            }
            
            if (country.title.toLowerCase().startsWith(searchValue.toLowerCase())) {
                addCountry(allCountriesEvent, allCountries);
                continue;
            }

            for (alternative of country.alternatives) {
                if (alternative.toLowerCase().startsWith(searchValue.toLowerCase())) {
                    addCountry(allCountriesEvent, allCountries);
                    continue loop;
                }
            }

            if (country.code.startsWith(searchValue)) {
                addCountry(allCountriesEvent, allCountries);
                continue;
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
})();