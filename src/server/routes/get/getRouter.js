/**
 * Routes the user to misc pages
 * 
 * @summary Routes the user to misc pages
 * 
 * @author Nathan Pease
 */

const express = require('express');
const route = express.Router();

const db = require('../../scripts/db');
const logs = require('../../scripts/logs');

const Config = require('../../models/config');
const Committee = require('../../models/committee');

// Route the user to the config page and send them the
// access code and the admin code (if they exist)
route.get('/config', async (req, res) => {
    const config = await db.findOne(Config, {});
    const committees = await db.find(Committee, {});

    if (!config || !committees) {
        return res.status(400).render('config', { accessCode: '', adminCode: '', committees: [] })
    }
    
    let accessCode;
    let adminCode;
    if (config) {
        accessCode = config.accessCode;
        adminCode = config.adminCode;
    }

    res.status(200);
    res.render('config', {accessCode, adminCode, committees});
});

route.get('/logs.prism', async (req, res) => {
    res.status(200).sendFile(logs.logsPath);
});

module.exports = route;