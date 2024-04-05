const express = require('express');
const id = require('../scripts/id');
const saveCookie = require('../scripts/cookies');

// Models
const Config = require('../models/config');
const User = require('../models/user');
const Committee = require('../models/committee');

const route = express.Router();

route.post('/createCommittee', async (req, res) => {
    // If name doesn't exist, it's a bad request
    if (!req.body.name) {
        res.status(400).end();
        return;
    }

    const committees = await Committee.find();
    const ids = committees.map((committee) => committee.id);
    const committeeId = id(32, ids);

    if (committeeId == -1) {
        res.status(500).end();
        return;
    }

    await new Committee({id: committeeId, name: req.body.name}).save();

    res.status(200).end();
});

route.post('/editCommittee/:id', async (req, res) => {
    // If name doesn't exist, bad request
    if (!req.body.name) {
        res.status(400).end();
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

route.post('/setup/:id', async (req, res) => {
    const id = req.params.id;

    const committee = await Committee.findOne({ id }).exec();

    if (committee) {
        committee.countries = req.body.selectedCountries;
        committee.setup = true;
        await committee.save();
    } else {
        res.status(400).end();
        return;
    }

    res.status(200).end();
});

route.post('/rollCall/:id', async (req, res) => {
    if (!req.body) {
        res.status(400).end();
        return;
    }

    const id = req.params.id;

    const committee = await Committee.findOne({ id }).exec();

    if (committee) {
        for (const country of req.body.countries) {
            if (!country.title || !country.code || !country.flagCode || !country.alternatives || !country.attendance) {
                res.status(400).end();
                return;
            }
        }

        committee.countries = req.body.countries;

        await committee.save();
    } else {
        res.status(400).end();
        return;
    }

    res.status(200).end();
});

route.post('/setAgenda/:id', async (req, res) => {
    if (!req.body.agenda) {
        res.status(400).end();
        return;
    }

    const id = req.params.id;

    const committee = await Committee.findOne({ id }).exec();

    if (committee) {
        committee.agenda = req.body.agenda;

        await committee.save();
    } else {
        res.status(400).end();
        return;
    }

    res.status(200).end();
});

route.post('/config', async (req, res) => {
    if (!req.body.accessCode || !req.body.adminCode) {
        res.status(400).end();
        return;
    }

    const config = await Config.findOne({}).exec();

    if (config) {
        config.accessCode = req.body.accessCode;
        config.adminCode = req.body.adminCode;
        await config.save();
    } else {
        await new Config({ accessCode: req.body.accessCode, adminCode: req.body.adminCode }).save();
    }

    res.status(200).end();
});

route.post('/auth', async (req, res) => {
    const config = await Config.findOne({});
    const accessCode = config.accessCode;

    if (accessCode == req.body.accessCode) {
        saveCookie(res, 'accessCode', accessCode);

        const firstName = req.body.firstName;
        const lastName = req.body.lastName;

        saveCookie(res, 'firstName', firstName);
        saveCookie(res, 'lastName', lastName);

        const user = await User.findOne({firstName, lastName });

        if (!user) {
            await new User({ firstName, lastName }).save();
        }

        res.status(200).end();
        return;
    }

    res.status(400).end();
});

route.post('/adminAuth', async (req, res) => {
    const config = await Config.findOne({});
    const adminCode = config.adminCode;

    if (adminCode == req.body.adminCode) {
        saveCookie(res, 'adminCode', adminCode);

        res.status(200).end();
        return;
    }

    res.status(400).end();
});

module.exports = route;
