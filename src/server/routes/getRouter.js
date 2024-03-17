const express = require('express');
const committeeOperations = require('../scripts/committees');
const constants = require('../utils/constants');
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

route.get('/edit/:id', (req, res) => {
    const id = req.params.id;

    const committee = committeeOperations.readCommittee(id);

    if (!committee) {
        res.status(400).end();
        return;
    }

    res.status(200);
    res.render('edit', { committee });
});

module.exports = route;