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

route.get('/session/:id', async (req, res) => {
    let committee;
    try {
        committee = await models.committee.find('id', req.params.id);
    } catch (err) {
        console.log(err);
        res.status(400).end();
        return;
    }

    if (!committee) {
        res.status(400).end();
        return;
    }

    if (committee.setup) {
        res.status(200);
        res.render('session/session');
    } else {
        res.redirect(`/session/${req.params.id}/setup`);
    }
});

route.get('/session/:id/setup', async (req, res) => {
    let name = '';


    try {
        const committee = await models.committee.find('id', req.params.id);
        name = committee.name;
    } catch (err) {
        console.log(err);
        res.status(400).end();
        return;
    }

    res.status(200);
    res.render('session/setup', {name});
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

route.get('*', (req, res) => {
    res.status(404);
    res.render('404', { originalUrl: req.originalUrl.substring(1) });
});







// TEST
route.get('/timer', (req, res) => {
    res.status(200);
    res.render('timer');
});

module.exports = route;