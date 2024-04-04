const mongoose = require('mongoose');

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