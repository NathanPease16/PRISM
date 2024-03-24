const database = require('./database');

async function routeToConfig(req, res, next) {
    if ((database.config && !await database.config.configured.read() && req.originalUrl != '/config') || !database.config) {
        res.redirect('/config');
        return;
    }

    next();
}

module.exports = routeToConfig;