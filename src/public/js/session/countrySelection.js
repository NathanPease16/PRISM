/**
 * Provides re-usable code for selecting a country. This is used
 * in things like setup and the GSL, places where countries need
 * to be selected and unselected, as well as placed in a specific
 * order
 * 
 * @summary Provides re-usable code for selecting a country
 * 
 * @author Nathan Pease
 */

/**
 * Reusable class for easily making a country selector (i.e. setup, mod, gsl, etc.)
 */
class CountrySelector {
    static instances = [];

    /**
     * Creates a new CountrySelector object
     * @param {*} name The name of the country selector (mod, gsl, etc.) for if there are multiple selectors on one page
     * @param {*} unselected Parameters for unselected countries (countries, parent, sort, beforeEvent, afterEvent)
     * @param {*} selected Parameters for selected countries (same as unselected)
     */
    constructor(name, unselected, selected) {
        this.name = name;

        // The countries that currently are selected and unselected
        this.unselectedCountries = unselected.countries;
        this.selectedCountries = selected.countries;
        
        // The parent (element in the document) to append selected and
        // unselected countries to
        this.unselectedParent = unselected.parent;
        this.selectedParent = selected.parent;

        // How to order selected/unselected countries (i.e. in order of
        // addition, alphabetically, alphanumerically, etc.)
        this.unselectedSort = unselected.sort;
        this.selectedSort = selected.sort;

        // The event that is called before the OPPOSITE action takes place
        // (so for unselected event, it is triggered BEFORE the select function
        // is called) (at one point this made sense to me, but i honestly can't
        // remember what my rationale was and it would probably to be too
        // catastrophic to change this so i'm keeping it like this)
        this.unselectBeforeEvent = unselected.beforeEvent;
        this.selectBeforeEvent = selected.beforeEvent;

        // The event called after the SAME action takes place (so for select event,
        // it would trigger after select() is called)
        this.unselectAfterEvent = unselected.afterEvent;
        this.selectAfterEvent = selected.afterEvent;

        this.unselectedParent.innerHTML = '';
        this.selectedParent.innerHTML = '';

        // Add this current object to the list of all selectors
        CountrySelector.instances.push(this);
    }

    // Returns all unselected countries
    getUnselected() {
        return this.unselectedCountries
    }

    // Returns all selected countries
    getSelected() {
        return this.selectedCountries;
    }

    /**
     * Renders the state of selected and unselected countries
     * to the document, and adds event listeners to each country
     */
    render() {
        // Clear both
        this.unselectedParent.innerHTML = '';
        this.selectedParent.innerHTML = '';

        // Sort all countries
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

    /**
     * Find a country 
     * @param {*} name The name of the country to look for
     * @param {*} arr The array to search
     * @returns The found country
     */
    findCountry(name, arr) {
        for (const country of arr) {
            if (country.title === name) {
                return country;
            }
        }

        return undefined;
    }

    /**
     * Selects a country
     * @param {*} name The name of the country to select 
     */
    select(name) {
        // Find the country in the list of unselected countries
        const country = this.findCountry(name, this.unselectedCountries);

        // Call the before event
        if (this.unselectBeforeEvent) {
            this.unselectBeforeEvent(country);
        }

        // If the country exists, remove it from the unselected list, add it to the 
        // selected list, and re-render the selector
        if (country) {
            this.unselectedCountries.splice(this.unselectedCountries.indexOf(country), 1);
            this.selectedCountries.push(country);
            this.render();
        }

        // Call the after event
        if (this.selectAfterEvent) {
            this.selectAfterEvent(country);
        }
    }
    
    /**
     * Unselects a country
     * @param {*} name The name of the country to unselect
     */
    unselect(name) {
        // Find the country
        const country = this.findCountry(name, this.selectedCountries);

        // Call the select before event
        if (this.selectBeforeEvent) {
            this.selectBeforeEvent(country);
        }

        // If the country exists, remove it from the selected list, add it to the 
        // unselected list, and re-render
        if (country) {
            this.selectedCountries.splice(this.selectedCountries.indexOf(country), 1);
            this.unselectedCountries.push(country);
            this.render();
        }

        // Call the unselect after event
        if (this.unselectAfterEvent) {
            this.unselectAfterEvent(country);
        }
    }

    /**
     * Adds a country to the selector
     * @param {*} country The country to add
     * @param {*} selected Whether or not the country should be added to the selected list
     */
    add(country, selected) {
        if (selected) {
            this.unselectedCountries.push(country);
            this.select(country.title);
        } else {
            this.selectedCountries.push(country);
            this.unselect(country.title);
        }
    }

    /**
     * Removes a country from the selector
     * @param {*} country Country to remove
     */
    remove(country) {
        // Determine whether or not the country is selected essentially
        // by brute forcing it and seeing which one returns an index
        // that isn't -1, meaning it was found
        const unselectedIndex = this.unselectedCountries.indexOf(country);
        const selectedIndex = this.selectedCountries.indexOf(country);
        
        if (unselectedIndex != -1) {
            this.unselectedCountries.splice(unselectedIndex, 1);
        } else if (selectedIndex != -1) {
            this.selectedCountries.splice(selectedIndex, 1);
        }

        this.render();
    }

    /**
     * Clear all countries from selected
     */
    clear() {
        this.unselectedCountries = [...this.unselectedCountries, ...this.selectedCountries];
        this.selectedCountries = [];

        this.render();
    }

    /**
     * Find an instance of a selector by name
     * @param {*} name Name of the selector
     * @returns The found selector
     */
    static findInstance(name) {
        for (const instance of CountrySelector.instances) {
            if (instance.name === name) {
                return instance;
            }
        }

        return undefined;
    }
}