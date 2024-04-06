const express = require('express');
const route = express.Router();

const Config = require('../../models/config');

route.post('/config', async (req, res) => {
    if (!req.body.accessCode) {
        res.status(400).json('Access Code is a required field');
        return;
    }
    if (!req.body.adminCode) {
        res.status(400).json('Admin Code is a required field');
        return;
    }

    const config = await Config.findOne({}).exec();

    if (config) {
        config.accessCode = req.body.accessCode;
        config.adminCode = req.body.adminCode;
        await config.save();
    } else {
        await new Config({ accessCode: req.body.accessCode, adminCode: req.body.adminCode }).save();
    }

    res.status(200).end();
});

module.exports = route;
