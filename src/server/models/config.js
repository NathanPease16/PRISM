const mongoose = require('mongoose');

// Establishes the schema for a config file
const configSchema = new mongoose.Schema({
    accessCode: String,
    adminCode: String,
});

const Config = mongoose.model('Config', configSchema);

module.exports = Config;