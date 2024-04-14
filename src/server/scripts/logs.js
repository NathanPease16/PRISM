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

function stampUser(logs, req) {
    if (req) {
        return logs.replace('<USER>', `${req.cookies.firstName} ${req.cookies.lastName}`);
    }

    return logs;
}

function log(serverLog) {
    fs.appendFileSync(logsPath, `[${serverLog.type}] [${date()}] [${serverLog.log}]\n`);
}

function error(serverLog, req) {
    log({ type: 'error', log: stampUser(serverLog, req) });
}

function warning(serverLog, req) {
    log({ type: 'warning', log: stampUser(serverLog, req) });
}

function information(serverLog, req) {

    log({ type: 'information', log: stampUser(serverLog, req) });
}

function clear() {
    fs.writeFileSync(logsPath, '');
}

module.exports = {
    log,
    error,
    warning,
    information,
    clear,
};