const database = require('./database');

async function routeToConfig(req, res, next) {
    if (database.config) {
        console.log(database.config);
        if (!await database.config.configured.read() && req.originalUrl != '/config') {
            res.redirect('/config');
            return;
        }       
    }

    next();
}

module.exports = routeToConfig;