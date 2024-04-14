/**
 * Adds logs to a file for preserving information about the server.
 * Allows developers to log information, warnings, and errors. Also
 * sends out a message using sockets to all listening clients letting
 * them know there was a new log
 */

const fs = require('fs');
const path = require('path');
const { emit } = require('../routes/sockets');

/**
 * PRISM logs file structure
 * 
 * [Type] [Timestamp] [Information]
 */

const logsPath = path.resolve(__dirname, '../storage/logs.prism');
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

function readLogs() {
    return fs.readFileSync(logsPath);
}

function log(serverLog) {
    const time = date();
    fs.appendFileSync(logsPath, `[${serverLog.type}] [${time}] [${serverLog.log}]\n`);
    emit('log', [serverLog.type, time, serverLog.log.toString()]);
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
    logsPath,
    readLogs,
    log,
    error,
    warning,
    information,
    clear,
};