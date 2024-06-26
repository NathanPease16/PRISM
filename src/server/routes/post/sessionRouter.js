/**
 * Handles all post requests for sessions, including
 * setup, roll call, and agenda setting
 * 
 * @summary Handles requests related to sessions
 * 
 * @author Nathan Pease
 */

const express = require('express');
const route = express.Router();

const db = require('../../scripts/db');

const Committee = require('../../models/committee');

// Attempts to set up a committee by storing in the database
// the countries that belong in it
route.post('/setup/:id', async (req, res) => {
    const id = req.params.id;

    const committee = await db.findOne(Committee, { id });

    // Checks if the committee exists and sorts all the countries in the
    // body in alphabetical order
    if (committee) {
        req.body.countries.sort((a, b) => {
            if (a.title < b.title) {
                return -1;
            } else if (a.title > b.title) {
                return 1;
            }
            return 0;
        });

        // Assign the countries and label the committee
        // as properly set up
        committee.countries = req.body.countries;
        committee.setup = true;
        const result = await db.save(committee);

        if (result === -1) {
            return res.status(500).json('Failed to save committee');
        }
    } else {
        return res.status(400).json('Committee not found');
    }

    res.status(200).end();
});

// Conducts roll call for a given committee
route.post('/rollCall/:id', async (req, res) => {
    if (!req.body) {
        res.status(400).json('Committee not found');
        return;
    }

    const id = req.params.id;

    const committee = await db.findOne(Committee, { id });

    if (committee === -1) {
        return res.status(500).json('Failed to find committee');
    }

    // Checks if the committee exists and then checks to make sure
    // each country in the committee has an attendance value 
    // (which should assigned by the client)
    if (committee) {
        for (const country of req.body.countries) {
            if (!country.attendance) {
                res.status(400).json(`${country.title} is missing an attendance value`);
                return;
            }
        }

        // Save the new country attendance data to the database
        committee.countries = req.body.countries;

        const result = await db.save(committee);

        if (result === -1) {
            return res.status(500).json('Failed to save committee');
        }
    } else {
        res.status(400).json('Committee not found');
        return;
    }

    res.status(200).end();
});

// Sets the agenda for a committee
route.post('/setAgenda/:id', async (req, res) => {
    // Ensures the agenda field is filled out
    if (!req.body.agenda) {
        res.status(400).json('Agenda is a required field');
        return;
    }

    const id = req.params.id;

    const committee = await db.findOne(Committee, { id });

    // Checks if the committee exists, assigns its agenda, and saves it
    if (committee) {
        committee.agenda = req.body.agenda;

        const result = await db.save(committee);

        if (result === -1) {
            res.status(500).json('Failed to save committee');
        }
    } else {
        return res.status(400).json('Committee not found');
    }

    res.status(200).end();
});

module.exports = route;