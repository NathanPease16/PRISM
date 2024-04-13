/**
 * Determines if a config file exists or not, and if a config
 * file does not exist routes the user to the config page,
 * overriding any admin authorization previously required
 * 
 * @summary Routes the user to the config page
 * 
 * @author Nathan Pease <nspease@stu.naperville203.org>
 */

const Config = require('../models/config');

/**
 * Routes the user to the config page if the server hasn't
 * gone through the initial setup flow
 * @param {*} req The user's request
 * @param {*} res The response to the client
 * @param {*} next The next middleware function
 * @returns 
 */
async function routeToConfig(req, res, next) {
    // Try to find the config file
    const configFile = await Config.findOne({});

    // If the config file doesn't exist AND the user isn't already
    // trying to access the config route, route them to the config page
    if (!configFile && req.originalUrl != '/config') {
        res.redirect('/config');
        return;
    }

    // If the config file exists, move forward with the next middleware
    // function and don't redirect the user
    next();
}

module.exports = routeToConfig;