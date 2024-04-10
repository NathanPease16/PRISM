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
        const country = this.findCountry(name, this.unselectedCountries);

        if (this.unselectBeforeEvent) {
            this.unselectBeforeEvent(country);
        }

        if (country) {
            this.unselectedCountries.splice(this.unselectedCountries.indexOf(country), 1);
            this.selectedCountries.push(country);
            this.render();
        }

        if (this.selectAfterEvent) {
            this.selectAfterEvent(country);
        }
    }

    unselect(name) {
        const country = this.findCountry(name, this.selectedCountries);

        if (this.selectBeforeEvent) {
            this.selectBeforeEvent(country);
        }

        if (country) {
            this.selectedCountries.splice(this.selectedCountries.indexOf(country), 1);
            this.unselectedCountries.push(country);
            this.render();
        }

        if (this.unselectAfterEvent) {
            this.unselectAfterEvent(country);
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