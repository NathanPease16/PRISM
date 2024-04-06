const express = require('express');
const route = express.Router();

const saveCookie = require('../../scripts/cookies');

const Config = require('../../models/config');
const User = require('../../models/user');

route.post('/auth', async (req, res) => {
    const config = await Config.findOne({});
    const accessCode = config.accessCode;

    if (accessCode == req.body.accessCode) {
        saveCookie(res, 'accessCode', accessCode);

        const firstName = req.body.firstName;
        const lastName = req.body.lastName;

        saveCookie(res, 'firstName', firstName);
        saveCookie(res, 'lastName', lastName);

        const user = await User.findOne({ firstName, lastName });

        if (!user) {
            await new User({ firstName, lastName }).save();
        }

        res.status(200).end();
        return;
    }

    res.status(400).json('Authorization failed');
});

route.post('/adminAuth', async (req, res) => {
    const config = await Config.findOne({});
    const adminCode = config.adminCode;

    if (adminCode == req.body.adminCode) {
        saveCookie(res, 'adminCode', adminCode);

        res.status(200).end();
        return;
    }

    res.status(400).json('Admin authorization failed');
});

module.exports = route;