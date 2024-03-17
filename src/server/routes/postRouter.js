const express = require('express');
const id = require('../scripts/id');
const committeeOperations = require('../scripts/committees');

const route = express.Router();

route.post('/createCommittee', (req, res) => {
    const data = req.body;

    if (!data.name) {
        res.status(400).end();
        return;
    }

    const committeesJson = committeeOperations.readCommittees();

    const ids = committeesJson.committees.map((committee) => committee.id);
    const committeeId = id(32, ids);

    if (committeeId == -1) {
        res.status(500).end();
        return;
    }

    const committee = {...req.body, id: committeeId};
    committeeOperations.writeCommittee(committee);

    res.status(200).end();
});

route.post('/edit/:id', (req, res) => {
    if (!req.body.name) {
        res.status(400).end();
        return;
    }

    const id = req.params.id;

    const committee = committeeOperations.readCommittee(id);

    if (!committee) {
        res.status(400).end();
        return;
    }

    committee.name = req.body.name;

    if (!committeeOperations.overwriteCommittee(committee)) {
        res.status(400).end();
        return;
    }
    

    res.status(200).end();
});

route.post('/delete/:id', (req, res) => {
    const id = req.params.id;

    if (!committeeOperations.deleteCommittee(id)) {
        res.status(400).end();
        return;
    }

    committeeOperations.deleteCommittees(true);

    res.status(200).end();
});

module.exports = route;
