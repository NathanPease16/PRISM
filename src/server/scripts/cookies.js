/**
 * Provides useful methods for conducting cookie operations
 * Currently, the only method provided is for saving, however
 * this file will grow in the event more operations are ever
 * needed
 * 
 * @summary Provides useful methods for conducting cookie operations
 * 
 * @author Nathan Pease
 */

/**
 * Saves a cookie to the client's device with the given name and value
 * @param {*} res The response to the client
 * @param {*} name Name of the cookie
 * @param {*} value Value to set the cookie to
 */
function save(res, name, value) {
    res.cookie(name, value, {
        httpOnly: true,
        secure: false, // CHANGE IN PRODUCTION,
        sameSite: 'strict',
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Lasts for ~ 1 year
    });
}

module.exports = save;