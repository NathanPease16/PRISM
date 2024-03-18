const constants = require('../utils/constants');
const path = require('path');
const fs = require('fs');

function getTemplate(templateName) {
    return fs.readFileSync(path.join(constants.JSON_TEMPLATES, templateName + '.template.json'));
}

function healDatabase() {
    let madeChanges = false;

    if (!fs.existsSync(constants.JSON_DATA)) {
        fs.mkdirSync(constants.JSON_DATA);
        madeChanges = true;
    }

    const databaseFiles = fs.readdirSync(constants.JSON_DATA).map((item) => item.split('.')[0]);
    const templateFiles = fs.readdirSync(constants.JSON_TEMPLATES).map((item) => item.split('.')[0]);

    for (const templateName of templateFiles) {
        if (!databaseFiles.includes(templateName)) {
            const template = getTemplate(templateName);

            fs.writeFileSync(path.join(constants.JSON_DATA, templateName + '.json'), template);
            madeChanges = true;
        }
    }

    if (madeChanges) {
        console.log('Healed database files successfully');
    }
}

module.exports = {
    getTemplate,
    healDatabase,
};