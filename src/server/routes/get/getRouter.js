const express = require('express');
const route = express.Router();

const Config = require('../../models/config');
const Committee = require('../../models/committee');

route.get('/config', async (req, res) => {
    const config = await Config.findOne({});
    const committees = await Committee.find();
    
    let accessCode;
    let adminCode;
    if (config) {
        accessCode = config.accessCode;
        adminCode = config.adminCode;
    }

    res.status(200);
    res.render('config', {accessCode, adminCode, committees});
});

module.exports = route;