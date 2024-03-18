const express = require('express');
const models = require('../scripts/models');

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

route.get('/edit/:id', async (req, res) => {
    const id = req.params.id;

    // Get committee by id
    const committee = await models.committee.find('id', id);

    // Make sure requested committee exists
    if (!committee) {
        res.status(400).end();
        return;
    }

    res.status(200);
    res.render('edit', { committee });
});

module.exports = route;