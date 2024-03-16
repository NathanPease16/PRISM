const constants = require('../global/constants');
const path = require('path');
const fs = require('fs');

function healDiscrepancies() {
    let madeChanges = false;

    if (!fs.existsSync(constants.JSON_DATA)) {
        fs.mkdirSync(constants.JSON_DATA);
        madeChanges = true;
    }

    const dataFiles = fs.readdirSync(constants.JSON_DATA);
    const templateFiles = fs.readdirSync(constants.JSON_TEMPLATES);

    for (const template of templateFiles) {
        const name = template.split('.')[0] + '.json';

        if (!dataFiles.includes(name)) {
            const contents = fs.readFileSync(path.join(constants.JSON_TEMPLATES, template));
            
            fs.writeFileSync(path.join(constants.JSON_DATA, name), contents);
            madeChanges = true;
        }
    }

    for (const data of dataFiles) {
        const name = data.split('.')[0] + '.template.json';

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