const fs = require('fs');
const constants = require('../utils/constants');

const models = fs.readdirSync(`${constants.JSON_MODELS}`);
const moduleExports = {};

for (const model of models) {
    let modelName = model.split('.')[0];
    modelName = modelName.charAt(0).toUpperCase() + modelName.substring(1).toLowerCase();

    const modelJson = JSON.parse(fs.readFileSync(`${constants.JSON_MODELS}/${model}`));
    moduleExports[modelName] = (obj) => {
        if (obj === undefined || obj === null) {
            throw new Error('Given object may not be null or undefined');
        } else if (typeof obj !== typeof {}) {
            throw new Error(`Given object must be of type '${typeof {}}'`)
        }

        const keys = Object.keys(obj);
        const modelKeys = Object.keys(modelJson);

        for (const key of modelKeys) {
            if (!keys.includes(key)) {
                throw new Error(`Given object does not contain a definition for key '${key}' found in model '${modelName}'`);
            }
        }

        for (const key of keys) {
            if (!modelKeys.includes(key)) {
                throw new Error(`Model '${modelName}' does not include a definition for key '${key}' found in given object`);
            }

            if (typeof modelJson[key] !== typeof obj[key]) {
                throw new Error(`Got type '${typeof obj[key]}' for key '${key}' in given object but model '${modelName}' expected type '${typeof modelJson[key]}'`);
            }
        }

        return {...obj};
    };
}

module.exports = moduleExports;