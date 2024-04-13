/**
 * Creates a schema for users
 * 
 * @summary Creates a schema for users
 * 
 * @author Nathan Pease <nspease@stu.naperville203.org>
 */

const mongoose = require('mongoose');

// Establishes the schema for a user in the database
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;