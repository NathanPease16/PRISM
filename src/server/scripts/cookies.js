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