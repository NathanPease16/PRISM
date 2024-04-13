/**
 * Handles general post requests that don't neatly
 * fit into one category
 * 
 * @summary Handles general post requests
 * 
 * @author Nathan Pease
 */

const express = require('express');
const route = express.Router();

const Config = require('../../models/config');

// Configures the config file
route.post('/config', async (req, res) => {
    // Ensure an access code is provided
    if (!req.body.accessCode) {
        res.status(400).json('Access Code is a required field');
        return;
    }

    // Ensure an admin code is provided 
    if (!req.body.adminCode) {
        res.status(400).json('Admin Code is a required field');
        return;
    }

    // Finds the config file
    const config = await Config.findOne({}).exec();

    // Checks if the config file exists and updates the access code and
    // admin code
    if (config) {
        config.accessCode = req.body.accessCode;
        config.adminCode = req.body.adminCode;
        await config.save();
    } else {
        // Creates a new config file if one doesn't exist already
        await new Config({ accessCode: req.body.accessCode, adminCode: req.body.adminCode }).save();
    }

    res.status(200).end();
});

module.exports = route;
