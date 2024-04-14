/**
 * Authorizes users to access a certain page by checking
 * their cookies and determining if they have entered the
 * correct access code (for both general and admin access routes)
 * 
 * @summary Authorizes users to access a certain page
 * 
 * @author Nathan Pease
 */

const Config = require('../models/config');

// All routes that should require admin authorization,
// which is more extensive than regular authorization
// (This can be expanded to both get and post requests)
const adminRoutes = [
    '/config',
]

/**
 * Middleware to ensure a user is authorized before allowing them to
 * continue with a request
 * @param {*} req Client's request
 * @param {*} res Response to the client
 * @param {*} next Next middleware function to call
 * @returns 
 */
async function authorize(req, res, next) {
    // Find the config file
    const config = await Config.findOne({});
    // Determine the original URL the user was trying to access before being routed
    // to the authorization page
    const originalUrl = req.originalUrl.split('?')[0];
    const userCode = req.cookies.accessCode;
    const userAdminCode = req.cookies.adminCode;

    // If a config file exists, continue
    if (config) {
        // If the code in the user's cookies doesn't equal the access code AND
        // the user isn't already on the auth page, route them to the auth page
        if (userCode != config.accessCode && originalUrl != '/auth') {
            res.redirect(`/auth?redirect=${encodeURIComponent(originalUrl)}`);
            return;
        // If the user's cookies are correct
        } else if (userCode == config.accessCode) {
            // If the route they were trying to access is "auth", route them home
            if (originalUrl == '/auth') {
                res.redirect('/');
                return;
            // If the route they're trying to access is an admin route, route them to the
            // admin authorization page
            } else if (adminRoutes.includes(originalUrl) && userAdminCode != config.adminCode) {
                res.redirect(`/adminAuth?redirect=${encodeURIComponent(originalUrl)}`);
                return;
            }
        }
    }

    // Run the next middleware function if they are properly authorized
    next();
}

module.exports = authorize;