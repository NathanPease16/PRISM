const e = new CustomEvent('execute');

function countrySelector(allCountries, countriesSelected, unselected, selected) {
    let countries = countriesSelected;

    const unselectedParent = unselected.parent || unselected;
    const unselectedSort = unselected.sort !== undefined ? unselected.sort : true;
    const unselectedBeforeEvent = unselected.beforeEvent || (() => {});
    const unselectedAfterEvent = unselected.afterEvent || (() => {});

    const selectedParent = selected.parent || selected;
    const selectedSort = selected.sort !== undefined ? selected.sort : true;
    const selectedBeforeEvent = selected.beforeEvent || (() => {});
    const selectedAfterEvent = selected.afterEvent || (() => {});


    unselectedParent.innerHtml = '';
    selectedParent.innerHtml = '';

    // Add ALL countries to selected and unselected
    for (const country of allCountries) {
        let unselectedStyle = '';
        let selectedStyle = 'display: none;';

        if (countries.filter((c) => c.title == country.title).length > 0) {
            unselectedStyle = 'display: none;';
            selectedStyle = '';
        }

        const unselectedCountry = instantiate('country', unselectedParent, {
            country: { style: unselectedStyle, id: country.title + '-unselected' },
            flag: { src: `/global/flags/${country.flagCode.toLowerCase()}.png` }, 
        }, {
            name: { textContent: country.title },
        });

        const selectedCountry = instantiate('country', selectedParent, {
            country: { style: selectedStyle, id: country.title + '-selected' },
            flag: { src: `/global/flags/${country.flagCode.toLowerCase()}.png` }, 
        }, {
            name: { textContent: country.title },
        });

        const unselectedFunction = () => {
            unselectedBeforeEvent(unselectedCountry, selectedCountry);
            countries.push(country);

            if (selectedSort) {
                selectedCountry.style = '';
            } else {
                const hiddenCountries = selectedParent.querySelectorAll(`:scope > *[style='display: none;']`);

                if (hiddenCountries.length > 1) {
                    for (const hiddenCountry of hiddenCountries) {
                        if (hiddenCountry.id != selectedCountry.id) {
                            selectedCountry.remove();
                            selectedCountry.style = '';
                            selectedParent.insertBefore(selectedCountry, hiddenCountry);
                            break;
                        }
                    }
                } else {
                    selectedCountry.remove();
                    selectedCountry.style = '';
                    selectedParent.appendChild(selectedCountry);
                }
            }

            if (unselectedSort) {
                unselectedCountry.style = 'display: none;';
            } else {
                unselectedCountry.remove();
                unselectedCountry.style = 'display: none;';
                unselectedParent.appendChild(unselectedCountry);
            }

            unselectedAfterEvent(unselectedCountry, selectedCountry);
        }

        const selectedFunction = () => {
            selectedBeforeEvent(selectedCountry, unselectedCountry);

            let index = -1;
            for (const i in countries) {
                if (countries[i].title == country.title) {
                    index = i;
                    break;
                }
            }

            countries.splice(index, 1);

            if (unselectedSort) {
                unselectedCountry.style = '';
            } else {
                const hiddenCountries = unselectedParent.querySelectorAll(`:scope > *[style='display: none;']`);

                if (hiddenCountries.length > 1) {
                    for (const hiddenCountry of hiddenCountries) {
                        if (hiddenCountry.id != unselectedCountry.id) {
                            unselectedCountry.remove();
                            unselectedCountry.style = '';
                            unselectedParent.insertBefore(unselectedCountry, hiddenCountry);
                            break;
                        }
                    }
                } else {
                    unselectedCountry.remove();
                    unselectedCountry.style = '';
                    unselectedParent.appendChild(unselectedCountry);
                }
            }

            if (selectedSort) {
                selectedCountry.style = 'display: none;';
            } else {
                selectedCountry.remove();
                selectedCountry.style = 'display: none;';
                selectedParent.appendChild(selectedCountry);
            }

            selectedAfterEvent(selectedCountry, unselectedCountry);
        }

        
        unselectedCountry.addEventListener('click', unselectedFunction);
        unselectedCountry.addEventListener('execute', unselectedFunction);

        selectedCountry.addEventListener('click', selectedFunction);
        selectedCountry.addEventListener('execute', selectedFunction);
    }
}

function executeUnselected(countryName) {
    document.getElementById(`${countryName}-unselected`).dispatchEvent(e);
}

function executeSelected(countryName) {
    document.getElementById(`${countryName}-selected`).dispatchEvent(e);
}