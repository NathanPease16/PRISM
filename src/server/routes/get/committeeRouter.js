const express = require('express');
const route = express.Router();

const Committee = require('../../models/committee');

// Route the user to the home page and give them
// all of the committees that currently exist
route.get('/', async (req, res) => {
    const committees = await Committee.find();

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