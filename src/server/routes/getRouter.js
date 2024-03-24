const express = require('express');
const models = require('../scripts/models');
const database = require('../scripts/database');

const route = express.Router();

route.get('/', (req, res) => {
    res.status(200);
    res.render('index');
});

route.get('/auth', (req, res) => {
    const firstName = req.cookies.firstName;
    const lastName = req.cookies.lastName;

    res.status(200);
    res.render('auth', {firstName, lastName});
});

route.get('/adminAuth', (req, res) => {
    res.status(200);
    res.render('adminAuth');
})

route.get('/config', async (req, res) => {
    const accessCode = await database.config.accessCode.read();
    const adminCode = await database.config.adminCode.read();

    res.status(200);
    res.render('config', {accessCode, adminCode});
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







// TEST
route.get('/timer', (req, res) => {
    res.status(200);
    res.render('timer');
});

module.exports = route;