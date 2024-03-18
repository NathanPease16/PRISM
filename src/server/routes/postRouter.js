const express = require('express');
const id = require('../scripts/id');
const models = require('../scripts/models');
const database = require('../scripts/database');

const route = express.Router();

route.post('/createCommittee', async (req, res) => {
    const data = req.body;

    // If name doesn't exist, it's a bad request
    if (!data.name) {
        res.status(400).end();
        return;
    }

    // Get all committees
    const committeesJson = await database.committees.read();

    // Generate random ID
    const ids = committeesJson.committees.map((committee) => committee.id);
    const committeeId = id(32, ids);

    // If -1 is returned an ID could not be generated
    if (committeeId == -1) {
        res.status(500).end();
        return;
    }

    // Create a new committee based on the committee model
    const committee = models.committee({...req.body, id: committeeId});
    
    // Add the new committee to the end of the committees array
    await database.committees.committees.append(committee);

    res.status(200).end();
});

route.post('/editCommittee/:id', async (req, res) => {
    // If name doesn't exist, bad request
    if (!req.body.name) {
        res.status(400).end();
        return;
    }

    const id = parseInt(req.params.id);

    // Create new committee with new name but same ID based on committee model
    const committee = models.committee({name: req.body.name, id: parseInt(id)});

    // Attempt to overwrite the old committee
    if (!(await database.committees.committees.overwriteItemByKey('id', id, committee))) {
        // If it couldn't overwrite the old committee, it was a bad request
        res.status(400).end();
        return;
    }
    
    res.status(200).end();
});

route.post('/deleteCommittee/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    // Try to discard the committee
    if (!await database.committees.committees.discardByKey('id', id)) {
        // If it couldn't be discarded, it was a bad request
        res.status(400).end();
        return;
    }

    res.status(200).end();
});

route.post('/deleteAllCommittees', async (req, res) => {
    // Write an empty array to committees array, effectively wiping it
    await database.committees.committees.write([]);

    res.status(200).end();
});

module.exports = route;
