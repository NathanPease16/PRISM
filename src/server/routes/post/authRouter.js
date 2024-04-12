const express = require('express');
const route = express.Router();

const saveCookie = require('../../scripts/cookies');

const Config = require('../../models/config');
const User = require('../../models/user');

// Attempts to authorize the user based on the given access code
route.post('/auth', async (req, res) => {
    // Get the correct access code from the config file
    const config = await Config.findOne({});
    const accessCode = config.accessCode;

    // If the access code lines up with the one given by the user,
    // store the correct access code in the user's cookies
    if (accessCode == req.body.accessCode) {
        saveCookie(res, 'accessCode', accessCode);

        // Get and save the user's first and last name to the cookies
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;

        saveCookie(res, 'firstName', firstName);
        saveCookie(res, 'lastName', lastName);

        // Find a user that exists with that first name and last name
        const user = await User.findOne({ firstName, lastName });

        // If a user with that name doesn't already exist, save one
        if (!user) {
            await new User({ firstName, lastName }).save();
        }

        res.status(200).end();
        return;
    }

    res.status(400).json('Authorization failed');
});

// Authorizes the user to access admin routes
route.post('/adminAuth', async (req, res) => {
    // Get the admin code from the config file
    const config = await Config.findOne({});
    const adminCode = config.adminCode;

    // Check if the admin code is equal to the code provided by the user
    if (adminCode == req.body.adminCode) {
        // Save the correct admin code to the cookies
        saveCookie(res, 'adminCode', adminCode);

        res.status(200).end();
        return;
    }

    res.status(400).json('Admin authorization failed');
});

module.exports = route;