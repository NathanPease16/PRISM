const constants = require('../utils/constants');
const fs = require('fs');

function writeCommittees(committees) {
    fs.writeFileSync(`${constants.JSON_DATA}/committees.json`, JSON.stringify(committees));
}

function writeCommittee(committee) {
    const committeesJson = readCommittees();
    
    committeesJson.committees.push(committee);
    writeCommittees(committeesJson);
}

function overwriteCommittee(committee) {
    const committeesJson = readCommittees();
    let completed = false;

    for (const i in committeesJson.committees) {
        if (committeesJson.committees[i].id == committee.id) {
            committeesJson.committees[i] = committee;
            completed = true;
        }
    }

    writeCommittees(committeesJson);

    return completed;
}

function deleteCommittees(intentional) {
    // checking to make sure intentional is 'true' and not a truthy value, as someone could
    // easily pass something like '4458586563120' if they meant to call deleteCommittee(id),
    // which is a truthy value and thus would count as intentional, even if it wasn't
    if (intentional !== true) {
        console.warn('deleteCommittees is a dangerous method that removes ALL committees. If you intended to call this method, pass \'true\' as the only parameter to indicate this was intentional.');
        return;
    }

    console.log(`All committees deleted by PERSON on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`);
}

function deleteCommittee(id) {
    const committeesJson = readCommittees();
    let completed = false;

    for (const i in committeesJson.committees) {
        if (committeesJson.committees[i].id == id) {
            committeesJson.committees.splice(i, 1);
            completed = true;
        }
    }

    writeCommittees(committeesJson);

    return completed;
}

function readCommittees() {
    return JSON.parse(fs.readFileSync(`${constants.JSON_DATA}/committees.json`));
}

function readCommittee(id) {
    const committeesJson = readCommittees();

    for (const c of committeesJson.committees) {
        if (c.id == id) {
            return c;
        }
    }

    return undefined;
}

module.exports = {
    writeCommittees,
    writeCommittee,
    overwriteCommittee,
    deleteCommittee,
    deleteCommittees,
    readCommittees,
    readCommittee,
}