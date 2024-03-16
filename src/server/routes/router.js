const express = require('express');
const constants = require('../utils/constants');
const id = require('../scripts/id');
const fs = require('fs');

const route = express.Router();

route.get('/', (req, res) => {
    res.status(200);
    res.render('index');
});

route.get('/timer', (req, res) => {
    res.status(200);
    res.render('timer');
});

route.get('/createCommittee', (req, res) => {
    res.status(200);
    res.render('createCommittee');
});

route.post('/createCommittee', (req, res) => {
    const data = req.body;

    if (!data.name) {
        res.status(400).end();
        return;
    }

    const committees = JSON.parse(fs.readFileSync(`${constants.JSON_DATA}/committees.json`));

    const ids = committees.committees.map((committee) => committee.id);
    const committeeId = id(32, ids);

    if (committeeId == -1) {
        res.status(500).end();
        return;
    }

    const committee = {...req.body, id: committeeId};

    committees.committees.push(committee);
    fs.writeFileSync(`${constants.JSON_DATA}/committees.json`, JSON.stringify(committees));

    res.status(200).end();
});

module.exports = route;