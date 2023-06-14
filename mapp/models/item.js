const mongoose = require('mongoose');

//shape data
const itemSchema = new mongoose.Schema({
    name: String,
    ordering: Number,
    status: String,
    image: String,
    created: {
        user_id: Number,
        user_name: String,
        time: Date
    },
    modified: {
        user_id: Number,
        user_name: String,
        time: Date
    }
},
    {
        timestamps: true
    });

const Item = mongoose.model('items', itemSchema);

module.exports = Item;
