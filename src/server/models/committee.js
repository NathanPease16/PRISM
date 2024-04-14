/**
 * Creates a schema for committees
 * 
 * @summary Creates a schema for committees
 * 
 * @author Nathan Pease
 */

const mongoose = require('mongoose');

// Establishes the schema for a committee in the database
const committeeSchema = new mongoose.Schema({
    name: String,
    id: Number,
    countries: {
        type: Array,
        default: [],
    },
    agenda: {
        type: String,
        default: '',
    },
    currentAction: {   
        type: Object,
        default: { type: 'Out of Session' },
    },
    sessionModerator: {
        type: String,
        default: '',
    },
    setup: {
        type: Boolean,
        default: false,
    },
});

const Committee = mongoose.model('Committee', committeeSchema);

module.exports = Committee;