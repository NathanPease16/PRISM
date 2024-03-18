const constants = require('../utils/constants');
const path = require('path');
const fs = require('fs');

function getTemplate(templateName) {
    return fs.readFileSync(path.join(constants.JSON_TEMPLATES, templateName + '.template.json'));
}

module.exports = {
    getTemplate,
};