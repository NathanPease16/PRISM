const fs = require('fs');
const path = require('path');

/**
 * PRISM logs file structure
 * 
 * [Type] [Timestamp] [Information]
 */

const logsPath = path.resolve(__dirname, '../../global/logs.prism');
const dateObject = new Date();

function date() {
    return `${dateObject.toLocaleString()}`;
}

function log(serverLog) {
    fs.appendFileSync(logsPath, `[${serverLog.type}] [${date()}] [${serverLog.information}]\n`);
}

function clear() {
    fs.writeFileSync(logsPath, '');
}

module.exports = {
    log,
    clear,
};