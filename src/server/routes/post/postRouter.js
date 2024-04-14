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

const logs = require('../../scripts/logs');
const db = require('../../scripts/db');

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
    const config = await db.findOne(Config, {});

    // Checks if the config file exists and updates the access code and
    // admin code
    let response;
    if (config) {
        config.accessCode = req.body.accessCode;
        config.adminCode = req.body.adminCode;
        response = await db.save(config);
    } else {
        // Creates a new config file if one doesn't exist already
        result = await db.save(new Config({ accessCode: req.body.accessCode, adminCode: req.body.adminCode }));
    }

    if (response === -1) {
        return res.status(500).json('Failed to save config file');
    }

    logs.information(`<USER> updated config; Access Code ${req.body.accessCode}; Admin Code ${req.body.adminCode}`, req);

    res.status(200).end();
});

module.exports = route;
