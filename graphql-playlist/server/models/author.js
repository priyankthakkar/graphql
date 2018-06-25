// A mongoose schema for author type
const mongoose = require('mongoose');
const Schmea = mongoose.Schema;

const authorSchema = new Schmea({
    name: String,
    age: Number
});

module.exports = mongoose.model('Author', authorSchema);