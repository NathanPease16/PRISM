/**
 * Handles all requests for both general and admin user
 * authorization. When handling a request, it checks to
 * make sure the given code lines up with the expected
 * access code, and then authorizes the user by saving
 * a cookie to their browser if that is the case
 * 
 * @summary Requests for a user to be authorized
 * 
 * @author Nathan Pease
 */

const express = require('express');
const route = express.Router();

const saveCookie = require('../../scripts/cookies');
const logs = require('../../scripts/logs');
const db = require('../../scripts/db');

const Config = require('../../models/config');
const User = require('../../models/user');

// Attempts to authorize the user based on the given access code
route.post('/auth', async (req, res) => {
    // Get the correct access code from the config file
    const config = await db.findOne(Config, {});

    if (config === -1) {
        return res.status(500).json('A server error has occurred');
    }
    // const config = req.result;
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
        const user = await db.findOne(User, { firstName, lastName });
        
        if (user === -1) {
            return res.status(500).json('Failed to access db');
        }
        
        // If a user with that name doesn't already exist, save one
        if (!user) {
            const result = await db.save(new User({firstName, lastName}));
            
            if (result === -1) {
                return res.status(500).json('Failed to save new user');
            }
        }

        logs.information(`${firstName} ${lastName} authorized`);

        res.status(200).end();
        return;
    }

    logs.warning(`Authorization for <USER> failed`, req);

    res.status(400).json('Authorization failed');
});

// Authorizes the user to access admin routes
route.post('/adminAuth', async (req, res) => {
    // Get the admin code from the config file
    const config = await db.findOne(Config, {});

    if (config === -1) {
        return res.status(500).json('A server has occurred');
    }
    const adminCode = config.adminCode;

    // Check if the admin code is equal to the code provided by the user
    if (adminCode == req.body.adminCode) {
        // Save the correct admin code to the cookies
        saveCookie(res, 'adminCode', adminCode);

        logs.information(`<USER> authorized with admin access`, req);

        res.status(200).end();
        return;
    }

    logs.warning(`Admin authorization for <USER> failed`, req);
    
    res.status(400).json('Admin authorization failed');
});

module.exports = route;