const EventEmitter = require('events');

const queue = [];
const eventEmitter = new EventEmitter();

let databaseInUse = false;

async function executeCallbacks() {
    if (databaseInUse) {
        return;
    }

    databaseInUse = true;

    while (queue.length > 0) {
        const callbackData = queue.shift();
        const result = await callbackData.callback(...callbackData.dependentResults);
        eventEmitter.emit('callback', {id: callbackData.id, result});
    }

    databaseInUse = false;
}

async function call(callback, ...dependents) {
    return new Promise(async (resolve, reject) => {
        const id = Date.now();

        const dependentResults = [];

        for (const dependent of dependents) {
            dependentResults.push(await dependent());
        }

        queue.push({ id, callback, dependentResults });
        executeCallbacks();

        const onCallback = (data) => {
            if (data.id == id) {
                eventEmitter.off('callback', onCallback);
                resolve(data.result);
            }
        };

        eventEmitter.on('callback', onCallback);

        setTimeout(() => {
            eventEmitter.off('callback', onCallback);
            reject('Database operation timed out');
        }, 10000);
    });
}

module.exports = call;