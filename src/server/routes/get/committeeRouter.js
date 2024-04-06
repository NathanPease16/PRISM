const express = require('express');
const route = express.Router();

const Committee = require('../../models/committee');

route.get('/', async (req, res) => {
    const committees = await Committee.find();

    res.status(200);
    res.render('committee/index', { committees });
});

route.get('/createCommittee', (req, res) => {
    res.status(200);
    res.render('committee/createCommittee');
});

route.get('/edit/:id', async (req, res) => {
    const id = req.params.id;
 
     const committee = await Committee.findOne({ id });
 
     if (!committee) {
         res.redirect(`/badGateway?old=${req.originalUrl}`);
         return;
     }
 
     res.status(200);
     res.render('committee/edit', { committee });
 });

module.exports = route;