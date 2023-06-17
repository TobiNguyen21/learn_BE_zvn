const mongoose = require('mongoose');

//shape data
const groupSchema = new mongoose.Schema({
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

const Group = mongoose.model('groups', groupSchema);

module.exports = Group;
