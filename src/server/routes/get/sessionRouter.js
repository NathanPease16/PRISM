const express = require('express');
const route = express.Router();

const Committee = require('../../models/committee');

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

module.exports = route;