class Search {
    constructor(name, parent) {
        this.name = name;
        this.parent = parent;

        this.searchBar = document.getElementById(`search-${name}`);

        this.searchBar.addEventListener('input', () => {

        });
    }
}

function setupSearch(name) {
    const searchBar = document.getElementById(`search-${name}`);
    const selector = CountrySelector.findInstance(name);

    searchBar.addEventListener('input', () => {
        const unselected = selector.getUnselected();
        
        for (const country of unselected) {
            const titleMatches = country.title.toLowerCase().startsWith(searchBar.value.toLowerCase());
            const codeMatches = country.code.startsWith(searchBar.value);

            let alternativeMatches = false;
            for (const alternative of country.alternatives) {
                if (alternative.toLowerCase().startsWith(searchBar.value.toLowerCase())) {
                    alternativeMatches = true;
                    break;
                }
            }

            if (titleMatches || codeMatches || alternativeMatches) {
                document.getElementById(`${country.title}-${name}-unselected`).style = '';
            } else {
                document.getElementById(`${country.title}-${name}-unselected`).style = 'display: none;';
            }
        }
    });
}