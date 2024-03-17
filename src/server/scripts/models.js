const fs = require('fs');
const constants = require('../utils/constants');

// Get all models from the models folder
const models = fs.readdirSync(`${constants.JSON_MODELS}`);

const moduleExports = {};

// Loop through all models and create methods to validate that a given object fits a model
for (const model of models) {
    // Get the model name and the model's JSON data
    const modelName = model.split('.')[0];
    const modelJson = JSON.parse(fs.readFileSync(`${constants.JSON_MODELS}/${model}`));
    
    // Add a new function to the exports with the name of the model's name that
    // ensures a given obj adheres to the specified model
    moduleExports[modelName] = (obj) => {
        // If the object isn't an object, throw an error
        if (obj === undefined || obj === null) {
            throw new Error('Given object may not be null or undefined');
        } else if (typeof obj !== typeof {}) {
            throw new Error(`Given object must be of type '${typeof {}}'`)
        }

        // Get the keys in the object and in the model
        const keys = Object.keys(obj);
        const modelKeys = Object.keys(modelJson);

        // If a key is found in the model's keys that doesn't exist in the
        // object's keys, throw an error
        for (const key of modelKeys) {
            if (!keys.includes(key)) {
                throw new Error(`Given object does not contain a definition for key '${key}' found in model '${modelName}'`);
            }
        }

        for (const key of keys) {
            // If the given object contain's a definition for a key that doesn't exist
            // in the model, throw an error
            if (!modelKeys.includes(key)) {
                throw new Error(`Model '${modelName}' does not include a definition for key '${key}' found in given object`);
            }

            // If the types don't match, throw an error
            if (typeof modelJson[key] !== typeof obj[key]) {
                throw new Error(`Got type '${typeof obj[key]}' for key '${key}' in given object but model '${modelName}' expected type '${typeof modelJson[key]}'`);
            }
        }

        // return a copy of the object
        return {...obj};
    };
}

module.exports = moduleExports;