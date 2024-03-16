// Import used modules
const express = require('express');
const fs = require('fs');
const constants = require('../utils/constants');

// Create the router
const route = express.Router();

// Get all of the data files
const dataFiles = fs.readdirSync(constants.JSON_DATA);

for (const file of dataFiles) {
    // For each data file, create a route that clones it and sends it to the client
    route.get(`/${file}`, (req, res) => {
        const fileData = require(`../../../${constants.JSON_DATA}/${file}`);
        const clone = {...fileData};

        res.json(clone);
    });
}

module.exports = route;