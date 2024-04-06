const express = require('express');
const route = express.Router();

const id = require('../../scripts/id');

const Committee = require('../../models/committee');

route.post('/createCommittee', async (req, res) => {
    // If name doesn't exist, it's a bad request
    if (!req.body.name) {
        res.status(400).json('Name is a required field');
        return;
    }

    const committees = await Committee.find();
    const ids = committees.map((committee) => committee.id);
    const committeeId = id(32, ids);

    if (committeeId == -1) {
        res.status(500).json('Failed to create committee');
        return;
    }

    await new Committee({id: committeeId, name: req.body.name}).save();

    res.status(200).end();
});

route.post('/editCommittee/:id', async (req, res) => {
    // If name doesn't exist, bad request
    if (!req.body.name) {
        res.status(400).json('Name is a required field');
        return;
    }

    const id = parseInt(req.params.id);

    await Committee.findOneAndUpdate({ id }, { name: req.body.name });

    res.status(200).end();
});

route.post('/deleteCommittee/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    await Committee.findOneAndDelete({ id });

    res.status(200).end();
});

route.post('/deleteAllCommittees', async (req, res) => {
    await Committee.deleteMany({});

    res.status(200).end();
});

module.exports = route;