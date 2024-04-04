const Config = require('../models/config');

const adminRoutes = [
    '/config',
]

async function authorize(req, res, next) {
    const config = await Config.findOne({});
    const originalUrl = req.originalUrl.split('?')[0];
    const userCode = req.cookies.accessCode;
    const userAdminCode = req.cookies.adminCode;

    if (config) {
        if (userCode != config.accessCode && originalUrl != '/auth') {
            res.redirect(`/auth?redirect=${encodeURIComponent(originalUrl)}`);
            return;
        } else if (userCode == config.accessCode) {
            if (originalUrl == '/auth') {
                res.redirect('/');
                return;
            } else if (adminRoutes.includes(originalUrl) && userAdminCode != config.adminCode) {
                res.redirect(`/adminAuth?redirect=${encodeURIComponent(originalUrl)}`);
                return;
            }
        }
    }

    next();
}

module.exports = authorize;

/*
const database = require('./database');

const adminAuthRoutes = [
    '/config',
];

async function authorize(req, res, next) {
    const configured = await database.config.configured.read();
    const accessCode = await database.config.accessCode.read();
    const adminCode = await database.config.adminCode.read();
    
    const originalUrl = req.originalUrl.split('?')[0];

    if (req.cookies.accessCode != accessCode && configured && originalUrl != '/auth') {
        res.redirect(`/auth?redirect=${encodeURIComponent(originalUrl)}`);
        return;
    } else if (req.cookies.accessCode == accessCode && configured) {
        if (originalUrl == '/auth') {
            res.redirect('/');
            return;
        } else if (adminAuthRoutes.includes(originalUrl) && req.cookies.adminCode != adminCode) {
            res.redirect(`/adminAuth?redirect=${encodeURIComponent(originalUrl)}`);
            return;
        }
    }

    next();
}

module.exports = authorize;
*/