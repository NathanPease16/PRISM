/**
 * Routes the user to the various session pages
 * 
 * @summary Routes the user to the various session pages
 * 
 * @author Nathan Pease <nspease@stu.naperville203.org>
 */

const express = require('express');
const route = express.Router();

const Committee = require('../../models/committee');

// Route the user to the session page
route.get('/session/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    
    // Try to find the committee pased on the ID in the requests parameters
    const committee = await Committee.findOne({ id });

    // If it doesn't exist, route them to the bad gateway page
    if (!committee) {
        res.redirect(`/badGateway?old=${req.originalUrl}`);
        return;
    }

    const name = `${req.cookies.firstName}.${req.cookies.lastName}`;

    // Route the user home if the committee already has a session moderator
    if (committee.sessionModerator !== '' && committee.sessionModerator !== name) {
        res.redirect('/');
        return;
    }

    // It it isn't set up, route them to the setup page
    if (!committee.setup) {
        res.redirect(`/session/${id}/setup`);
        return;
    }

    // Render the session page
    res.status(200);
    res.render('session/session', { committee });
});

// Routes the user to the setup page for a session
route.get('/session/:id/setup', async (req, res) => {
    const id = req.params.id;

    const committee = await Committee.findOne({ id });

    // If the committee doesn't exist, route the user to the bad gateway page
    if (!committee) {
        res.redirect(`/badGateway?old=${req.originalUrl}`);
        return;
    }

    const name = `${req.cookies.firstName}.${req.cookies.lastName}`;

    // Route user home if there is already a session moderator
    if (committee.sessionModerator !== '' && committee.sessionModerator !== name) {
        res.redirect('/');
        return;
    }

    // Render the setup page
    res.status(200);
    res.render('session/setup', { committee });
});

// Routes the user to the status page based on the id after /status/
route.get('/status/:id', async (req, res) => {
    const id = req.params.id;

    const committee = await Committee.findOne({ id });

    // If the committee doesn't exist, give bad gateway
    if (!committee) {
        res.redirect(`/badGateway?old=${req.originalUrl}`);
        return;
    }

    // Render the status page
    res.status(200);
    res.render('session/status', { committee });
});

module.exports = route;