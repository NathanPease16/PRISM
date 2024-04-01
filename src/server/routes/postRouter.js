const express = require('express');
const id = require('../scripts/id');
const models = require('../scripts/models');
const database = require('../scripts/database');
const save = require('../scripts/cookies');

const route = express.Router();

route.post('/createCommittee', async (req, res) => {
    const data = req.body;

    // If name doesn't exist, it's a bad request
    if (!data.name) {
        res.status(400).end();
        return;
    }

    // Get all committees
    const committees = await models.committee.findAll();

    // Generate random ID
    const ids = committees.map((committee) => committee.id);
    const committeeId = id(32, ids);

    // If -1 is returned an ID could not be generated
    if (committeeId == -1) {
        res.status(500).end();
        return;
    }

    const otherKeyValues = {};
    for (const key of Object.keys(models.committee.model)) {
        if (key == 'name' || key == 'id') {
            continue;
        }

        otherKeyValues[key] = models.committee.model[key];
    }

    // Create a new committee based on the committee model
    const committee = models.committee.committee({...req.body, id: committeeId, ...otherKeyValues});
    
    // Add the new committee to the end of the committees array
    await models.committee.save(committee);

    res.status(200).end();
});

route.post('/editCommittee/:id', async (req, res) => {
    // If name doesn't exist, bad request
    if (!req.body.name) {
        res.status(400).end();
        return;
    }

    const id = parseInt(req.params.id);

    try {
        await models.committee.overwriteKey('id', id, 'name', req.body.name);
    } catch (err) {
        console.log(err);
        res.status(400).end();
        return;
    }

    res.status(200).end();
});

route.post('/deleteCommittee/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    // Try to discard the committee
    if (!await models.committee.remove('id', id)) {
        // If it couldn't be discarded, it was a bad request
        res.status(400).end();
        return;
    }

    res.status(200).end();
});

route.post('/deleteAllCommittees', async (req, res) => {
    // Clear the database
    await models.committee.clear();

    res.status(200).end();
});

route.post('/setup/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await models.committee.overwriteKey('id', id, 'countries', req.body.selectedCountries);
    } catch (err) {
        console.log(err);
        res.status(400).end();
        return;
    }

    try {
        await models.committee.overwriteKey('id', id, 'setup', true);
    } catch (err) {
        console.log(err);
        res.status(400).end();
        return;
    }

    res.status(200).end();
});

route.post('/config', async (req, res) => {
    if (!req.body.accessCode || !req.body.adminCode) {
        res.status(400).end();
        return;
    }

    await database.config.accessCode.write(req.body.accessCode);
    await database.config.adminCode.write(req.body.adminCode);
    await database.config.configured.write(true);

    res.status(200).end();
});

route.post('/auth', async (req, res) => {
    const accessCode = await database.config.accessCode.read();

    if (accessCode == req.body.accessCode) {
        save(res, 'accessCode', accessCode);

        const users = await models.user.findAll();

        const firstName = req.body.firstName;
        const lastName = req.body.lastName;

        for (const user of users) {
            if (user.firstName == firstName && user.lastName == lastName) {
                save(res, 'firstName', firstName);
                save(res, 'lastName', lastName);
                res.status(200).end();
                return;
            }
        }

        await models.user.save({firstName, lastName});
        save(res, 'firstName', firstName);
        save(res, 'lastName', lastName);

        res.status(200).end();
        return;
    }

    res.status(400).end();
});

route.post('/adminAuth', async (req, res) => {
    const adminCode = await database.config.adminCode.read();

    if (adminCode == req.body.adminCode) {
        save(res, 'adminCode', adminCode);

        res.status(200).end();
        return;
    }

    res.status(400).end();
});

module.exports = route;
