/**
 * Re-usable code for a search bar for countries. This specific
 * search checks 3 different parameters;
 * 1. Does the search match the name of the country?
 * 2. Does the search match any alternative names for the country?
 * 3. Does the search match the 3-digit country code?
 * 
 * @summary Re-usable code for a search bar for countries
 * 
 * @author Nathan Pease
 */

/**
 * Sets up the search functionality, allowing users to search for a country
 * @param {*} name The name of the search (for if there are multiple on a page)
 */
function setupSearch(name) {
    const searchBar = document.getElementById(`search-${name}`);
    const selector = CountrySelector.findInstance(name);

    searchBar.addEventListener('input', () => {
        // Get all unselected countries
        const unselected = selector.getUnselected();
        
        for (const country of unselected) {
            // Check if the title matches or country code matches
            const titleMatches = country.title.toLowerCase().startsWith(searchBar.value.toLowerCase());
            const codeMatches = country.code.startsWith(searchBar.value);

            // Check if any alternatives match
            let alternativeMatches = false;
            for (const alternative of country.alternatives) {
                if (alternative.toLowerCase().startsWith(searchBar.value.toLowerCase())) {
                    alternativeMatches = true;
                    break;
                }
            }

            // If the title, code, or alternatives match, show the country
            // otherwise, hide it
            if (titleMatches || codeMatches || alternativeMatches) {
                document.getElementById(`${country.title}-${name}-unselected`).style = '';
            } else {
                document.getElementById(`${country.title}-${name}-unselected`).style = 'display: none;';
            }
        }
    });
}