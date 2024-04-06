const express = require('express');
const route = express.Router();

route.get('/auth', (req, res) => {
    const firstName = req.cookies.firstName;
    const lastName = req.cookies.lastName;

    res.status(200);
    res.render('auth/auth', {firstName, lastName});
});

route.get('/adminAuth', (req, res) => {
    res.status(200);
    res.render('auth/adminAuth');
});

module.exports = route;