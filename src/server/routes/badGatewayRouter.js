const express = require('express');

const route = express.Router();

route.get('/badGateway', (req, res) => {
    res.status(404);
    let originalUrl = 'unknown';
    try {
        originalUrl = req.query.old.substring(1);
    } catch (err) {

    }

    res.render('404', {originalUrl});
});

route.get('*', (req, res) => {
    res.status(404);
    res.render('404', {originalUrl: req.originalUrl.substring(1)});
});

module.exports = route;