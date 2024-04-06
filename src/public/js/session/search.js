function setupSearch(countries, selectedCountries) {
    const search = document.getElementById('search');

    search.addEventListener('input', () => {
        for (const country of countries) {
            if (selectedCountries.filter((c) => c.title == country.title).length > 0) {
                continue;
            }

            const titleMatches = country.title.toLowerCase().startsWith(search.value.toLowerCase());
            const codeMatches = country.code.startsWith(search.value);


            if (titleMatches || codeMatches) {
                document.getElementById(`${country.title}-unselected`).style = '';
            } else {
                document.getElementById(`${country.title}-unselected`).style = 'display: none;';
            }
        }
    });
}