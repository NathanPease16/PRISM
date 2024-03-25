(async () => {
    const response = await fetch('/global/UN_Nations.txt');
    const data = await response.text();

    const countryNames = data.split('\r\n');

    const countries = [];

    for (const countryNameSet of countryNames) {
        const country = {};

        const names = countryNameSet.split(' | ');
        country.title = names[0];
        country.code = names[names.length - 1];
        country.alternatives = [];

        for (i = 1; i < names.length - 1; i++) {
            country.alternatives.push(names[i]);    
        }

        countries.push(country);
    }

    console.log(countries);
})();