const express = require('express');
const constants = require('../utils/constants');
const id = require('../scripts/id');
const fs = require('fs');

const getCommittees = () => JSON.parse(fs.readFileSync(`${constants.JSON_DATA}/committees.json`));

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

route.get('/edit/:id', (req, res) => {
    const id = req.params.id;

    const committees = getCommittees();

    let committee;
    for (const c of committees.committees) {
        if (c.id == id) {
            committee = c;
            break;
        }
    }

    if (!committee) {
        res.status(400).end();
        return;
    }

    res.status(200);
    res.render('edit', { committee });
});

route.post('/createCommittee', (req, res) => {
    const data = req.body;

    if (!data.name) {
        res.status(400).end();
        return;
    }

    const committees = getCommittees();

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

route.post('/edit/:id', (req, res) => {
    if (!req.body.name) {
        res.status(400).end();
        return;
    }

    const id = req.params.id;

    const committees = getCommittees();

    let committee;
    for (const c of committees.committees) {
        if (c.id == id) {
            committee = c;
            break;
        }
    }

    if (!committee) {
        res.status(400).end();
        return;
    }

    committee.name = req.body.name;
    fs.writeFileSync(`${constants.JSON_DATA}/committees.json`, JSON.stringify(committees));
    res.status(200).end();
});

route.post('/delete/:id', (req, res) => {
    const id = req.params.id;

    const committees = getCommittees();

    for (const i in committees.committees) {
        if (committees.committees[i].id == id) {
            committees.committees.splice(i, 1);
            fs.writeFileSync(`${constants.JSON_DATA}/committees.json`, JSON.stringify(committees));
            res.status(200).end();
            return;
        }
    }

    res.status(400).end();
});

module.exports = route;