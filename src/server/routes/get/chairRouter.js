const express = require('express');
const route = express.Router();

route.get('/chair/:id', async (req, res) => {
    res.render('chair');
});

module.exports = route;