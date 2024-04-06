const express = require('express');
const route = express.Router();

const Committee = require('../../models/committee');

route.post('/setup/:id', async (req, res) => {
    const id = req.params.id;

    const committee = await Committee.findOne({ id }).exec();

    if (committee) {
        committee.countries = req.body.selectedCountries;
        committee.setup = true;
        await committee.save();
    } else {
        res.status(400).json('Committee not found');
        return;
    }

    res.status(200).end();
});

route.post('/rollCall/:id', async (req, res) => {
    if (!req.body) {
        res.status(400).json('Committee not found');
        return;
    }

    const id = req.params.id;

    const committee = await Committee.findOne({ id }).exec();

    if (committee) {
        for (const country of req.body.countries) {
            if (!country.attendance) {
                res.status(400).json(`${country.title} is missing an attendance value`);
                return;
            }
        }

        committee.countries = req.body.countries;

        await committee.save();
    } else {
        res.status(400).json('Committee not found');
        return;
    }

    res.status(200).end();
});

route.post('/setAgenda/:id', async (req, res) => {
    if (!req.body.agenda) {
        res.status(400).json('Agenda is a required field');
        return;
    }

    const id = req.params.id;

    const committee = await Committee.findOne({ id }).exec();

    if (committee) {
        committee.agenda = req.body.agenda;

        await committee.save();
    } else {
        res.status(400).json('Committee not found');
        return;
    }

    res.status(200).end();
});

module.exports = route;