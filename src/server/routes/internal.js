// Import used modules
const express = require('express');
const fs = require('fs');
const database = require('../scripts/database');
const constants = require('../utils/constants');

// Create the router
const route = express.Router();

// Get all of the data files
const dataFiles = fs.readdirSync(constants.JSON_DATA).map((file) => file.split('.')[0]);

for (const file of dataFiles) {
    // For each data file, create a route that clones it and sends it to the client
    route.get(`/${file}.json`, async (req, res) => {
        const fileData = await database[file].read();
        const clone = {...fileData};

        res.json(clone);
    });
}

module.exports = route;