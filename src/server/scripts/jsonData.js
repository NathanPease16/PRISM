const constants = require('../utils/constants');
const path = require('path');
const fs = require('fs');

// Ensures that json/data has the same files as outlined in
// json/templates
function healDiscrepancies() {
    let madeChanges = false;

    // If json/data doesn't exist, create it
    if (!fs.existsSync(constants.JSON_DATA)) {
        fs.mkdirSync(constants.JSON_DATA);
        madeChanges = true;
    }

    // Get all the current data files and all the template files
    const dataFiles = fs.readdirSync(constants.JSON_DATA);
    const templateFiles = fs.readdirSync(constants.JSON_TEMPLATES);

    for (const template of templateFiles) {
        const name = template.split('.')[0] + '.json';

        // If json/data doesn't have a template file, create it based on
        // that template file's contents
        if (!dataFiles.includes(name)) {
            const contents = fs.readFileSync(path.join(constants.JSON_TEMPLATES, template));
            
            fs.writeFileSync(path.join(constants.JSON_DATA, name), contents);
            madeChanges = true;
        }
    }

    for (const data of dataFiles) {
        const name = data.split('.')[0] + '.template.json';

        // If a data file exists without a corresponding template
        // file, remove it
        if (!templateFiles.includes(name)) {
            fs.rmSync(path.join(constants.JSON_DATA, data));
            madeChanges = true;
        }
    }

    if (madeChanges) {
        console.log('Healed JSON data, server must be restarted...');
    }
}

module.exports = healDiscrepancies;