/**
 * Handles requests for committees, including creating,
 * deleting, editing, and removing all committees
 * 
 * @summary Handles requests for committees
 * 
 * @author Nathan Pease <nspease@stu.naperville203.org>
 */

const express = require('express');
const route = express.Router();

const id = require('../../scripts/id');

const Committee = require('../../models/committee');

// Attempts to create a new committee
route.post('/createCommittee', async (req, res) => {
    // If name doesn't exist, it's a bad request
    if (!req.body.name) {
        res.status(400).json('Name is a required field');
        return;
    }

    // Find all committees and create a list of their IDs
    const committees = await Committee.find();
    const ids = committees.map((committee) => committee.id);
    // Generate a new random committee ID, while avoiding collisions
    // with pre-existing committee IDs
    const committeeId = id(32, ids);

    // Check if the ID is -1, meaning the ID generation failed
    if (committeeId == -1) {
        res.status(500).json('Failed to create committee');
        return;
    }

    // Create a new committee with the generated ID and name given by the user
    const committee = new Committee({id: committeeId, name: req.body.name}); 
    await committee.save();

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

    // Find the committee with the given ID and update its name
    await Committee.findOneAndUpdate({ id }, { name: req.body.name });

    res.status(200).end();
});

// Attempts to delete a committee
route.post('/deleteCommittee/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    await Committee.findOneAndDelete({ id });

    res.status(200).end();
});

// Removes all committees from the database
route.post('/deleteAllCommittees', async (req, res) => {
    await Committee.deleteMany({});

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
    await Committee.findOneAndUpdate({ id }, { currentAction: req.body.action });

    res.status(200).end();
});

module.exports = route;