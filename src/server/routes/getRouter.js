const express = require('express');

// Models
const Committee = require('../models/committee');
const Config = require('../models/config');

const route = express.Router();

route.get('/', async (req, res) => {
    const committees = await Committee.find();

    res.status(200);
    res.render('index', { committees });
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
    const config = await Config.findOne({});
    
    let accessCode;
    let adminCode;
    if (config) {
        accessCode = config.accessCode;
        adminCode = config.adminCode;
    }

    res.status(200);
    res.render('config', {accessCode, adminCode});
});

route.get('/session/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    
    const committee = await Committee.findOne({ id });

    if (!committee) {
        res.redirect(`/badGateway?old=${req.originalUrl}`);
        return;
    }

    if (!committee.setup) {
        res.redirect(`/session/${id}/setup`);
        return;
    }

    res.status(200);
    res.render('session/session', { committee });
});

route.get('/session/:id/setup', async (req, res) => {
    const id = req.params.id;

    const committee = await Committee.findOne({ id });

    if (!committee) {
        res.redirect(`/badGateway?old=${req.originalUrl}`);
        return;
    }

    res.status(200);
    res.render('session/setup', { committee });
});

route.get('/createCommittee', (req, res) => {
    res.status(200);
    res.render('createCommittee');
});

route.get('/edit/:id', async (req, res) => {
   const id = req.params.id;

    const committee = await Committee.findOne({ id });

    if (!committee) {
        res.redirect(`/badGateway?old=${req.originalUrl}`);
        return;
    }

    res.status(200);
    res.render('edit', { committee });
});

route.get('/test', (req, res) => {
    res.render('test');
});







// TEST
route.get('/timer', (req, res) => {
    res.status(200);
    res.render('timer');
});

module.exports = route;