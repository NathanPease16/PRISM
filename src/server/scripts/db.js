/**
 * Using mongoose, it attempts to connect the app to 
 * the given mongo URI. If the connection fails, the 
 * application exits, as the database is an essential
 * component of the server
 * 
 * @summary Connects the app to the database
 * 
 * @author Nathan Pease
 */

const mongoose = require('mongoose');
const logs = require('../scripts/logs');

/**
 * Connects the server to the mongo database using mongoose
 * @param {*} mongoUri URI to the mongo database (must include user & password)
 */
async function connect(mongoUri) {
    try {
        await mongoose.connect(mongoUri);
        console.log('Successfully connected to MongoDB via Mongoose');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

const find = async (Model, query) => {
    try {
        const result = await Model.find(query);
        return result;
    } catch (err) {
        logs.error(err);
        return undefined;
    }
}

const findOne = async (Model, query) => {
    try {
        const result = await Model.findOne(query);
        return result;
    } catch (err) {
        logs.error(err);
        return undefined;
    }
}

const findOneAndUpdate = async (Model, query, update) => {
    try {
        await Model.findOneAndUpdate(query, update);
        return 1;
    } catch (err) {
        logs.error(err);
        return -1;
    }
}

const findOneAndDelete = async (Model, query) => {
    try {
        await Model.findOneAndDelete(query);
        return 1; 
    } catch (err) {
        logs.error(err);
        return -1;
    }
}

const deleteMany = async (Model, query) => {
    try {
        await Model.deleteMany(query);
        return 1;
    } catch (err) {
        logs.error(err);
        return -1;
    }
}

const save = async (model) => {
    try {
        await model.save();
        return 1;
    } catch (err) {
        logs.error(err);
        return -1;
    }
}

module.exports = {
    connect,
    find,
    findOne,
    findOneAndUpdate,
    findOneAndDelete,
    save,
    deleteMany,
};