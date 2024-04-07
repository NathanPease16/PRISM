class CountrySelector {
    static instances = [];

    constructor(name, unselected, selected) {
        this.name = name;

        this.unselectedCountries = unselected.countries;
        this.selectedCountries = selected.countries;
        
        this.unselectedParent = unselected.parent;
        this.selectedParent = selected.parent;

        this.unselectedSort = unselected.sort;
        this.selectedSort = selected.sort;

        this.unselectBeforeEvent = unselected.beforeEvent;
        this.selectBeforeEvent = selected.beforeEvent;

        this.unselectAfterEvent = unselected.afterEvent;
        this.selectAfterEvent = selected.afterEvent;

        this.unselectedParent.innerHTML = '';
        this.selectedParent.innerHTML = '';

        CountrySelector.instances.push(this);
    }

    getUnselected() {
        return this.unselectedCountries
    }

    getSelected() {
        return this.selectedCountries;
    }

    render() {
        // Clear both
        this.unselectedParent.innerHTML = '';
        this.selectedParent.innerHTML = '';

        this.selectedCountries.sort(this.selectedSort);
        this.unselectedCountries.sort(this.unselectedSort);

        // Loop through all the currently selected countries
        for (const country of this.selectedCountries) {
            const selectedCountry = instantiate('country', this.selectedParent, {
                country: { id: `${country.title}-${this.name}-selected` },
                flag: { src: `/global/flags/${country.flagCode.toLowerCase()}.png` }, 
            }, {
                name: { textContent: country.title },
            });

            selectedCountry.addEventListener('click', () => {
                this.unselect(country.title);
            });
        }

        // Loop through all the currently unselected countries
        for (const country of this.unselectedCountries) {
            const unselectedCountry = instantiate('country', this.unselectedParent, {
                country: { id: `${country.title}-${this.name}-unselected` },
                flag: { src: `/global/flags/${country.flagCode.toLowerCase()}.png` }, 
            }, {
                name: { textContent: country.title },
            });

            unselectedCountry.addEventListener('click', () => {
                this.select(country.title);
            });
        }
    }

    findCountry(name, arr) {
        for (const country of arr) {
            if (country.title === name) {
                return country;
            }
        }

        return undefined;
    }

    select(name) {
        if (this.selectBeforeEvent) {
            this.selectBeforeEvent();
        }
        

        const country = this.findCountry(name, this.unselectedCountries);

        if (country) {
            this.unselectedCountries.splice(this.unselectedCountries.indexOf(country), 1);
            this.selectedCountries.push(country);
            this.render();
        }

        if (this.selectAfterEvent) {
            this.selectAfterEvent();
        }
    }

    unselect(name) {
        if (this.unselectBeforeEvent) {
            this.unselectBeforeEvent();
        }

        const country = this.findCountry(name, this.selectedCountries);

        if (country) {
            this.selectedCountries.splice(this.selectedCountries.indexOf(country), 1);
            this.unselectedCountries.push(country);
            this.render();
        }

        if (this.unselectAfterEvent) {
            this.unselectAfterEvent();
        }
    }

    add(country, selected) {
        if (selected) {
            this.unselectedCountries.push(country);
            this.select(country.title);
        } else {
            this.selectedCountries.push(country);
            this.unselect(country.title);
        }
    }

    remove(country) {
        const unselectedIndex = this.unselectedCountries.indexOf(country);
        const selectedIndex = this.selectedCountries.indexOf(country);
        
        if (unselectedIndex != -1) {
            this.unselectedCountries.splice(unselectedIndex, 1);
        } else if (selectedIndex != -1) {
            this.selectedCountries.splice(selectedIndex, 1);
        }

        this.render();
    }

    clear() {
        this.unselectedCountries = [...this.unselectedCountries, ...this.selectedCountries];
        this.selectedCountries = [];

        this.render();
    }

    static findInstance(name) {
        for (const instance of CountrySelector.instances) {
            if (instance.name === name) {
                return instance;
            }
        }

        return undefined;
    }
}

/*
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
*/