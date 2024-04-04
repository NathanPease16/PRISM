const Config = require('../models/config');

async function routeToConfig(req, res, next) {
    const configFile = await Config.findOne({});

    if (!configFile && req.originalUrl != '/config') {
        res.redirect('/config');
        return;
    }

    next();
}

module.exports = routeToConfig;