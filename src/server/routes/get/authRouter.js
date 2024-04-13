/**
 * Routes the user to authorization pages
 * 
 * @summary Routes the user to authorization pages
 * 
 * @author Nathan Pease
 */

const express = require('express');
const route = express.Router();

// Route the user to the auth page
// and pass along the first name and
// last name listed in their cookies
route.get('/auth', (req, res) => {
    const firstName = req.cookies.firstName;
    const lastName = req.cookies.lastName;

    res.status(200);
    res.render('auth/auth', {firstName, lastName});
});

// Route the user to the admin page
route.get('/adminAuth', (req, res) => {
    res.status(200);
    res.render('auth/adminAuth');
});

module.exports = route;