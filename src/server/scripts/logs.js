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

/**
 * Returns back the current time as a string
 * @returns The current local time
 */
function date() {
    return `${dateObject.toLocaleString()}`;
}

/**
 * Replaces the text <USER> with the actual user's name (if request is defined)
 * @param {*} logs Text to replace
 * @param {*} req The request
 * @returns The new text
 */
function stampUser(logs, req) {
    if (req) {
        return logs.replace('<USER>', `${req.cookies.firstName} ${req.cookies.lastName}`);
    }

    return logs;
}

/**
 * Returns back the data in the logs
 * @returns The data in the logs
 */
function readLogs() {
    return fs.readFileSync(logsPath);
}

/**
 * Misc log function for logging a generic type of logs
 * @param {*} serverLog The information to log
 */
function log(serverLog) {
    const time = date();
    fs.appendFileSync(logsPath, `[${serverLog.type}] [${time}] [${serverLog.log}]\n`);
    emit('log', [serverLog.type, time, serverLog.log.toString()]);
}

/**
 * Logs an error to the server
 * @param {*} serverLog Error to log
 * @param {*} req Request information
 */
function error(serverLog, req) {
    log({ type: 'error', log: stampUser(serverLog, req) });
}

/**
 * Logs a warning to the server
 * @param {*} serverLog Warning to log
 * @param {*} req Request information
 */
function warning(serverLog, req) {
    log({ type: 'warning', log: stampUser(serverLog, req) });
}

/**
 * Logs information to the server
 * @param {*} serverLog Information to log
 * @param {*} req Request information
 */
function information(serverLog, req) {

    log({ type: 'information', log: stampUser(serverLog, req) });
}

/**
 * Clears all logs
 */
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