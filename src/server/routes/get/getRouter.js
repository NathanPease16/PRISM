const express = require('express');
const route = express.Router();

const Config = require('../../models/config');

route.get('/config', async (req, res) => {
    const config = await Config.findOne({});
    
    let accessCode;
    let adminCode;
    if (config) {
        accessCode = config.accessCode;
        adminCode = config.adminCode;
    }

    res.status(200);
    res.render('config', {accessCode, adminCode});
});

route.get('/test', (req, res) => {
    res.render('test');
});

module.exports = route;