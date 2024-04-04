const express = require('express');

const route = express.Router();
const fs = require('fs');

route.get('/gsl.ejs', async (req, res) => {
    const innerHtml = fs.readFileSync('src/views/session/views/gsl.ejs').toString();
    res.json({innerHtml});
});

route.get('/motions.ejs', async (req, res) => {
    const innerHtml = fs.readFileSync('src/views/session/views/motions.ejs').toString();
    res.json({innerHtml});
});

route.get('/voting.ejs', async (req, res) => {
    const innerHtml = fs.readFileSync('src/views/session/views/voting.ejs').toString();
    res.json({innerHtml});
});

module.exports = route;