/**
 * Routes the user to the various committee pages
 * 
 * @summary Routes the user to the various committee pages
 * 
 * @author Nathan Pease
 */

const express = require('express');
const route = express.Router();

const db = require('../../scripts/db');
const logs = require('../../scripts/logs');

const Committee = require('../../models/committee');

// Route the user to the home page and give them
// all of the committees that currently exist
route.get('/', async (req, res) => {
    const committees = await db.find(Committee, {});

    if (!committees) {
        return res.status(400).render('committee/index', { committees: [] });
    }

    res.status(200);
    res.render('committee/index', { committees });
});

// Route the user to the create committee page
route.get('/createCommittee', (req, res) => {
    res.status(200);
    res.render('committee/createCommittee');
});

// Route the user to the edit page, where :id can be
// anything, meaning this route handles editing for all
// committees
route.get('/edit/:id', async (req, res) => {
    //const committee = req.result;
    const committee = await db.findOne(Committee, { id: req.params.id });
 
    if (!committee) {
        return res.status(400).redirect(`/badGateway?old=${req.originalUrl}`);
    }
 
    res.status(200);
    res.render('committee/edit', { committee });
 });

module.exports = route;