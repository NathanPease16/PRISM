const express = require('express');
const path = require('path');
const fs = require('fs');
const constants = require('../global/constants');
// const committees = require('../../../json/data/committees.json');

const route = express.Router();

const dataFiles = fs.readdirSync(constants.JSON_DATA);

for (const file of dataFiles) {
    route.get(`/${file}`, (req, res) => {
        const fileData = require(`../../../${constants.JSON_DATA}/${file}`);
        const clone = {...fileData};

        res.json(clone);
    });
}

/*
route.get('/committees.json', (req, res) => {
    const committeesClone = {...committees};

    res.json(committeesClone);
});
*/

module.exports = route;