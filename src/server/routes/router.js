const express = require('express');

const route = express.Router();

route.get('/', (req, res) => {
    res.status(200);
    res.render('index');
});

route.get('/timer', (req, res) => {
    res.status(200);
    res.render('timer');
})

module.exports = route;