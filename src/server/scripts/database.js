/**
 * Handles database operations by creating an object to be exported, where each
 * dataset (i.e. 'users', 'committees', etc.) is its own key in that object. Each
 * dataset key is itself an object that has a key for various each operation
 * that can be performed on it, such as 'read' and 'write' Additionally, each dataset
 * object has a key for all of its JSON object's keys. Each of these JSON object keys
 * is also an object, with keys for each operation that can be called on it. Some datatypes
 * (like arrays) have their own custom methods for common operations that are performed on them
 * 
 * Example:
 * 
 * config.json:
 * {
 *  "users": [],
 *  "password": ""
 * }
 * 
 * database export:
 * {
 *  config: {
 *      read: [Function: read],
 *      write: [Function: write],
 *      create: [Function: create],
 *      resetToTemplate[Function: resetToTemplate],
 *      users: {
 *          read: [Function: readKey],
 *          write: [Function: writeKey],
 *          modify: [Function: modifyKey],
 *          remove: [Function: removeKey],
 *          getItemByKey: [Function: getItemByKey],
 *          append: [Function: append],
 *          overwriteItem: [Function: overwriteItem],
 *          overwriteItemByKey: [Function: overwriteItemByKey],
 *          discard: [Function: discard],
 *          discardByKey: [Function: discardByKey]
 *      },
 *      password: {
 *          read: [Function: readKey],
 *          write: [Function: writeKey],
 *          modify: [Function: modifyKey],
 *          remove: [Function: removeKey],
 *      }
 *  }
 * }
 */

const fs = require('fs');
const path = require('path');
const call = require('./databaseQueue');
const constants = require('../utils/constants');
const getTemplate = require('../scripts/templates');

const dataFiles = fs.readdirSync(`${constants.JSON_DATA}`);

let moduleExports = {}

function heal() {
    let madeChanges = false;

    if (!fs.existsSync(constants.JSON_DATA)) {
        fs.mkdirSync(constants.JSON_DATA);
        madeChanges = true;
    }

    const databaseFiles = fs.readdirSync(constants.JSON_DATA).map((item) => item.split('.')[0]);
    const templateFiles = fs.readdirSync(constants.JSON_TEMPLATES).map((item) => item.split('.')[0]);
    const modelFiles = fs.readdirSync(constants.JSON_MODELS).map((item) => item.split('.')[0]);

    for (const templateName of templateFiles) {
        if (!databaseFiles.includes(templateName)) {
            const template = getTemplate(templateName);

            fs.writeFileSync(path.join(constants.JSON_DATA, templateName + '.json'), template);
            madeChanges = true;
        }
    }

    for (const modelName of modelFiles) {
        if (!databaseFiles.includes(modelName + 's')) {
            const contents = '{"data":[]}';

            fs.writeFileSync(path.join(constants.JSON_DATA, modelName + 's.json'), contents);
            madeChanges = true;
        }
    }

    if (madeChanges) {
        console.log('Healed database files successfully');
    }
}

moduleExports = {
    ...moduleExports,
    heal,
}

/**
 * Generates an object containing all the methods that can be
 * performed on a key in a dataset
 * @param {string} dataName The name of the dataset
 * @param {string} key Key in the dataset to write methods for
 * @returns Key module values
 */
async function createKeyMethods(dataName, key) {
    /**
     * Reads the value of the key
     * @returns The read value
     */
    const readKey = () => {
        return new Promise(async (resolve, reject) => {
            const data = await moduleExports[dataName].read();
            resolve(data[key]);
            // resolve((await moduleExports[dataName].read())[key]);
        });
    }

    /**
     * Writes a given value to the key
     * @param {*} value Value to right to the key
     */
    const writeKey = async (value) => {
        const data = await moduleExports[dataName].read();
        data[key] = value;
        await moduleExports[dataName].write(data);
    }

    /**
     * Modifies a key's value based on the given operation
     * @param {Function} operation Operation to perform on the key's value
     */
    const modifyKey = async (operation) => {
        const data = await moduleExports[dataName].read();
        data[key] = operation(data[key]);
        await moduleExports[dataName].write(data);
    }

    /**
     * Removes the key from the dataset
     */
    const removeKey = async () => {
        const data = await moduleExports[dataName].read();
        delete data[key];
        delete moduleExports[dataName][key];
        await moduleExports[dataName].write(data);
    }
    
    let keyExports = {
        read: readKey,
        write: writeKey,
        modify: modifyKey,
        remove: removeKey,
    }

    // If the key is of type array, first define array-specific
    // methods and then add them to the key exports
    // All functions defined here can be done using the modifyKey 
    // function, however since these are such common operations
    // they have been pre-defined here to make things easier
    if (Array.isArray(await readKey())) {
        /**
         * Finds an item in a key of type array based on the given 
         * identifier and identifier value
         * @param {*} identifier Name of the identifier to look for
         * @param {*} identifierValue Value of the identifier to look for
         * @returns The item (if found)
         */
        const getItemByKey = (identifier, identifierValue) => {
            return new Promise(async (resolve, reject) => {
                const data = await moduleExports[dataName].read();

                for (const element of data[key]) {
                    if (element[identifier] == identifierValue) {
                        resolve(element);
                    }
                }

                resolve(undefined);
            });
        }

        /**
         * Appends an item to the end of a key of type array
         * @param {*} value The value to append
         */
        const append = async (value) => {
            const data = await moduleExports[dataName].read();
            data[key].push(value);
            await moduleExports[dataName].write(data);
        }

        /**
         * Overwrites the first item in a key of type array with a value of `oldValue` with `newValue`
         * @param {*} oldValue The value to look for
         * @param {*} newValue The value to replace `oldValue` with
         * @returns If an item equal to `oldValue` was found
         */
        const overwriteItem = async (oldValue, newValue) => {
            return new Promise(async (resolve, reject) => {
                const data = await moduleExports[dataName].read();
                let found = false;

                for (const i in data[key]) {
                    if (data[key][i] == oldValue) {
                        data[key][i] = newValue;
                        found = true;
                        break;
                    }
                }

                await moduleExports[dataName].write(data);
                
                resolve(found);
            });
        }

        /**
         * Overwrites an item based on the given identifier and identifier value
         * @param {*} identifier Name of the identifier to look for
         * @param {*} identifierValue value of the identifier to look for
         * @param {*} newValue Value to replace the old value with
         * @returns If an item with an identifier equal to `identifierValue` was found
         */
        const overwriteItemByKey = (identifier, identifierValue, newValue) => {
            return new Promise(async (resolve, reject) => {
                const data = await moduleExports[dataName].read();
                let found = false;

                for (const i in data[key]) {
                    if (data[key][i][identifier] == identifierValue) {
                        data[key][i] = newValue;
                        found = true;
                        break;
                    }
                }

                await moduleExports[dataName].write(data);
                
                resolve(found);
            });
        }

        /**
         * Deletes the first item in a key of type array with a value of `value`
         * @param {*} value The value to search for
         * @returns Whether or not an item with a value of `value` was found
         */
        const discard = (value) => {
            return new Promise(async (resolve, reject) => {
                const data = await moduleExports[dataName].read();
                let found = false;

                for (const i in data[key]) {
                    if (data[key][i] == value) {
                        data[key].splice(i, 1);
                        found = true;
                        break;
                    }
                }

                await moduleExports[dataName].write(data);
                
                resolve(found);
            });
        }

        /**
         * Deletes the first element in a key of type array with an identifier of value `identifierValue`
         * @param {*} identifier Name of the identifier to look for
         * @param {*} identifierValue value of the identifier to look for
         * @returns Whether or not an item with an identifier of `identifierValue` was found
         */
        const discardByKey = (identifier, identifierValue) => {
            return new Promise(async (resolve, reject) => {
                const data = await moduleExports[dataName].read();
                let found = false;

                for (const i in data[key]) {
                    if (data[key][i][identifier] == identifierValue) {
                        data[key].splice(i, 1);
                        found = true;
                        break;
                    }
                }

                await moduleExports[dataName].write(data);
                
                resolve(found);
            });
        }

        keyExports = {
            ...keyExports,
            getItemByKey,
            append,
            overwriteItem,
            overwriteItemByKey,
            discard,
            discardByKey,
        }
    }

    return keyExports;
}

/**
 * Modifies the exports for the keys in the dataset to reflect its new structure
 * @param {*} dataName The name of the dataset
 * @param {*} oldData Old data format
 * @param {*} newData New data format
 */
async function updateKeyExports(dataName, oldData, newData) {
    // Get old & new keys
    const oldKeys = Object.keys(oldData);
    const newKeys = Object.keys(newData);

    // Remove any old keys that don't exist anymore
    for (const oldKey of oldKeys) {
        if (!newKeys.includes(oldKey)) {
            await moduleExports[dataName][oldKey].remove();
        }
    }

    // Add new keys that didn't exist before
    for (const newKey of newKeys) {
        if (!oldKeys.includes(newKey)) {
            moduleExports[dataName][newKey] = await createKeyMethods(dataName, newKey);
        }
    }
}

// Loops through all files in json/data and adds them to the module's exports
for (const dataFile of dataFiles) {
    const dataName = dataFile.split('.')[0];

    /**
     * Reads the data of a file and returns it as a JSON
     * @returns The data in the file
     */
    const read = () => {
        return call(() => {
            return JSON.parse(fs.readFileSync(`${constants.JSON_DATA}/${dataFile}`));
        });
    }

    /**
     * Completely overwrites the database with the new data and updates the export's keys for the dataset
     * @param {*} dataObj The data to write to the dataset
     */
    const write = async (dataObj) => {
        await call(async () => {
            fs.writeFileSync(`${constants.JSON_DATA}/${dataFile}`, JSON.stringify(dataObj));
        });
        
        const oldData = await read();
        await updateKeyExports(dataName, oldData, dataObj);
    };

    /**
     * Creates a new key with the specified value for the dataset
     * @param {*} key Key name
     * @param {*} value Value to set the key to
     */
    const create = (key, value) => {
        return new Promise(async (resolve, reject) => {
            const data = await read();
            data[key] = value;
            await write(data);
            resolve();
        });
    }

    /**
     * Completely clears the dataset to be an empty object
     */
    const clear = async () => {
        await write({});
    }

    /**
     * Sets the dataset to a template
     * @param {*} templateName The name of the template to set it to
     */
    const resetToTemplate = async (templateName) => {
        const templateData = JSON.parse(templates.getTemplate(templateName));
        await write(templateData);
    }

    moduleExports[dataName] = {
        read,
        write,
        create,
        clear,
        resetToTemplate,
    };

    // Assigns all of the keys in the dataset with their functions
    (async () => {
        const keys = Object.keys(await read());

        for (const key of keys) {
            const keyExports = await createKeyMethods(dataName, key);
            moduleExports[dataName][key] = keyExports;
        }
    })();
}

module.exports = moduleExports;