const mongoose = require('mongoose');

//shape data
const itemSchema = new mongoose.Schema({
    name: String,
    status: String,
    ordering: Number,
});

const Item = mongoose.model('item', itemSchema);

module.exports = Item;
