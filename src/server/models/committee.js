const mongoose = require('mongoose');

const committeeSchema = new mongoose.Schema({
    name: String,
    id: Number,
    countries: {
        type: Array,
        default: [],
    },
    setup: {
        type: Boolean,
        default: false,
    },
});

const Committee = mongoose.model('Committee', committeeSchema);

module.exports = Committee;