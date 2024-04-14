/**
 * Handles requests for committees, including creating,
 * deleting, editing, and removing all committees
 * 
 * @summary Handles requests for committees
 * 
 * @author Nathan Pease
 */

const express = require('express');
const route = express.Router();

const id = require('../../scripts/id');
const logs = require('../../scripts/logs');
const db = require('../../scripts/db');

const Committee = require('../../models/committee');

// Attempts to create a new committee
route.post('/createCommittee', async (req, res) => {
    // If name doesn't exist, it's a bad request
    if (!req.body.name) {
        res.status(400).json('Name is a required field');
        return;
    }

    // Find all committees and create a list of their IDs
    const committees = await db.find(Committee, {});

    if (committees === -1) {
        return res.status(500).json('Failed to create committee');
    }

    const ids = committees.map((committee) => committee.id);
    // Generate a new random committee ID, while avoiding collisions
    // with pre-existing committee IDs
    const committeeId = id(32, ids);

    // Check if the ID is -1, meaning the ID generation failed
    if (committeeId == -1) {
        logs.error('Committee creation failed: ID = -1');
        res.status(500).json('Failed to create committee');
        return;
    }

    // Create a new committee with the generated ID and name given by the user
    const committee = new Committee({id: committeeId, name: req.body.name}); 
    const result = await db.save(committee);

    if (result === -1) {
        return res.status(500).json('Failed to save committee');
    }

    logs.information(`<USER> created committee '${committee.name}'`, req);

    res.status(200).json(committee);
});

// Attempts to edit a committee specified by the user
route.post('/editCommittee/:id', async (req, res) => {
    // If name doesn't exist, bad request
    if (!req.body.name) {
        res.status(400).json('Name is a required field');
        return;
    }

    const id = parseInt(req.params.id);

    const oldCommittee = await db.findOne(Committee, { id });

    if (oldCommittee === -1) {
        return res.status(500).json('Failed to find committee');
    }

    // Find the committee with the given ID and update its name
    const result = await db.findOneAndUpdate(Committee, { id }, { name: req.body.name });

    if (result === -1) {
        return res.status(500).json('Failed to update committee');
    }

    logs.information(`<USER> edited committee '${oldCommittee.name}'; now ${req.body.name}`, req);

    res.status(200).end();
});

// Attempts to delete a committee
route.post('/deleteCommittee/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    const committee = await db.findOne(Committee, { id });

    if (committee === -1) {
        return res.status(500).json('Failed to find committee');
    }

    const result = await db.findOneAndDelete(Committee, { id });

    if (result === -1) {
        return res.status(400).json('Failed to delete committee');
    }

    logs.information(`<USER> deleted committee ${committee.name}`, req);

    res.status(200).end();
});

// Removes all committees from the database
route.post('/deleteAllCommittees', async (req, res) => {
    const result = await db.deleteMany(Committee, {});

    if (result === -1) {
        return res.status(400).json('Failed to delete committees');
    }

    logs.information('<USER> deleted all committees', req);

    res.status(200).end();
});

// Sets the current action for a committeee so that it can be accessed
// when viewing the status of a committee (i.e. "Out of Session" or "Voting")
route.post('/action/:id', async (req, res) => {
    if (!req.body.action) {
        res.status(400).json('Action is required');
        return;
    }

    const id = parseInt(req.params.id);

    // Delete the ID from the action object as it is no longer needed
    delete req.body.action.id;

    // Find and update the committee with the new current action
    const result = await db.findOneAndUpdate(Committee, { id }, { currentAction: req.body.action });

    if (result === -1) {
        return res.status(400).json('Failed to update committee action');
    }

    res.status(200).end();
});

module.exports = route;