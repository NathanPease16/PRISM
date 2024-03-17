const fs = require('fs');
const constants = require('../utils/constants');

const dataFiles = fs.readdirSync(`${constants.JSON_DATA}`);

const moduleExports = {}

for (const dataFile of dataFiles) {
    const dataName = dataFile.split('.')[0];

    const read = () => {
        return JSON.parse(fs.readFileSync(`${constants.JSON_DATA}/${dataFile}`));
    }

    const write = (dataObj) => {
        fs.writeFileSync(`${constants.JSON_DATA}/${dataFile}`, JSON.stringify(dataObj));
    }

    function createKeyMethods(key) {
        const readKey = () => {
            return read()[key];
        }
    
        const writeKey = (value) => {
            const data = read();
            data[key] = value;
            write(data);
        }
    
        const modifyKey = (operation) => {
            const data = read();
            data[key] = operation(data[key]);
            write(data);
        }
    
        const clearKey = () => {
            const data = read();
            delete data[key];
            write(data);
        }
    
        const readItemByKey = (identifier, identifierValue) => {
            const data = read();

            for (const element of data[key]) {
                if (element[identifier] == identifierValue) {
                    return element;
                }
            }
    
            return undefined;
        }
    
        const append = (value) => {
            const data = read();
            data[key].push(value);
            write(data);
        }
    
        const overwriteItem = (oldValue, newValue) => {
            const data = read();
            let found = false;
    
            for (const i in data[key]) {
                if (data[key][i] == oldValue) {
                    data[key][i] = newValue;
                    found = true;
                    break;
                }
            }
    
            write(data);
            
            return found;
        }

        const overwriteItemByKey = (identifier, identifierValue, newValue) => {
            const data = read();
            let found = false;

            for (const i in data[key]) {
                if (data[key][i][identifier] == identifierValue) {
                    data[key][i] = newValue;
                    found = true;
                    break;
                }
            }

            write(data);
            
            return found;
        }
    
        const discard = (value) => {
            const data = read();
            let found = false;
    
            for (const i in data[key]) {
                if (data[key][i] == value) {
                    data[key].splice(i, 1);
                    found = true;
                    break;
                }
            }
    
            write(data);
            
            return found;
        }

        const discardByKey = (identifier, identifierValue) => {
            const data = read();
            let found = false;

            for (const i in data[key]) {
                if (data[key][i][identifier] == identifierValue) {
                    data[key].splice(i, 1);
                    found = true;
                    break;
                }
            }

            write(data);
            
            return found;
        }
        
        const keyExports = {
            read: readKey,
            write: writeKey,
            modify: modifyKey,
            clear: clearKey,
    
            readElementByKey: readItemByKey,
            append: append,
            overwriteItem: overwriteItem,
            overwriteItemByKey: overwriteItemByKey,
            discard: discard,
            discardByKey: discardByKey,
    
        }
    
        return keyExports;
    }

    const create = (key, value) => {
        const data = read();

        data[key] = value;
        moduleExports[dataName][key] = createKeyMethods(key);

        write(data);
    }

    const clear = () => {
        write({});
    }

    const resetToTemplate = (templateName) => {
        const templateData = JSON.parse(fs.readFileSync(`${constants.JSON_TEMPLATES}/${templateName}.template.json`));
        write(templateData);
    }

    moduleExports[dataName] = {
        read,
        write,
        create,
        clear,
        resetToTemplate,
    };

    const keys = Object.keys(read());

    for (const key of keys) {
        const keyExports = createKeyMethods(key);
        moduleExports[dataName][key] = keyExports;
    }
}

module.exports = moduleExports;