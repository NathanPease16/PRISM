/**
 * Routes the user to bad gateway page
 * 
 * @summary Routes the user to bad gateway page
 * 
 * @author Nathan Pease
 */

const express = require('express');

const route = express.Router();

// Display the "bad gateway" page to the user
// if the route they enter is invalid
route.get('/badGateway', (req, res) => {
    res.status(404);
    let originalUrl = 'unknown';
    try {
        originalUrl = req.query.old.substring(1);
    } catch (err) {

    }

    res.render('404', { originalUrl });
});

// For all remaining routes not explicitly added,
// route the user to the 404 page
route.get('*', (req, res) => {
    res.status(404);
    let originalUrl = 'unknown';
    try {
        originalUrl = req.query.old.substring(1);
    } catch (err) {

    }

    res.render('404', { originalUrl });
});

module.exports = route;