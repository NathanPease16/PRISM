const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    accessCode: String,
    adminCode: String,
});

const Config = mongoose.model('Config', configSchema);

module.exports = Config;