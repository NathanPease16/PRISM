const mongoose = require('mongoose');

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

module.exports = connect;