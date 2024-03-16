const express = require('express');
const fs = require('fs');
const constants = require('../global/constants');

const route = express.Router();

const dataFiles = fs.readdirSync(constants.JSON_DATA);

for (const file of dataFiles) {
    route.get(`/${file}`, (req, res) => {
        const fileData = require(`../../../${constants.JSON_DATA}/${file}`);
        const clone = {...fileData};

        res.json(clone);
    });
}

module.exports = route;