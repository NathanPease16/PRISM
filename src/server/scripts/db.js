/**
 * Using mongoose, it attempts to connect the app to 
 * the given mongo URI. If the connection fails, the 
 * application exits, as the database is an essential
 * component of the server
 * 
 * Also includes safer database operations with automated
 * error handling to avoid server crashes
 * 
 * @summary Creates safer database operations
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

/**
 * Safely finds all instances of a query in a model
 * @param {*} Model Model to search
 * @param {*} query Query parameters to look for
 * @returns All results
 */
const find = async (Model, query) => {
    try {
        const result = await Model.find(query);
        return result;
    } catch (err) {
        logs.error(err);
        return undefined;
    }
}

/**
 * Safely finds first instance of a query in a model
 * @param {*} Model Model to search
 * @param {*} query Query parameters to look for
 * @returns The first search result
 */
const findOne = async (Model, query) => {
    try {
        const result = await Model.findOne(query);
        return result;
    } catch (err) {
        logs.error(err);
        return undefined;
    }
}

/**
 * Safely finds and updates the first instance of a query in a model
 * @param {*} Model Model to search
 * @param {*} query Query parameters to look for
 * @param {*} update Values to update
 * @returns 1 if successful, -1 if failed
 */
const findOneAndUpdate = async (Model, query, update) => {
    try {
        await Model.findOneAndUpdate(query, update);
        return 1;
    } catch (err) {
        logs.error(err);
        return -1;
    }
}

/**
 * Safely finds and deletes the first instance of a query in a model
 * @param {*} Model Model to search
 * @param {*} query Query parameters to look for
 * @returns 1 if successful, -1 if failed
 */
const findOneAndDelete = async (Model, query) => {
    try {
        await Model.findOneAndDelete(query);
        return 1; 
    } catch (err) {
        logs.error(err);
        return -1;
    }
}

/**
 * Safely finds and deletes all instances of a query in a model
 * @param {*} Model Model to search
 * @param {*} query Query parameters to look for
 * @returns 1 if successful, -1 if failed
 */
const deleteMany = async (Model, query) => {
    try {
        await Model.deleteMany(query);
        return 1;
    } catch (err) {
        logs.error(err);
        return -1;
    }
}

/**
 * Safely saves an instance of a model to the database
 * @param {*} model Model instance to save
 * @returns 1 if successful, -1 if failed
 */
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