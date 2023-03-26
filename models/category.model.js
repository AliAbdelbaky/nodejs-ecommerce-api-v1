const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
    name: String
})

const catModel = mongoose.model('Category', catSchema)

module.exports = catModel