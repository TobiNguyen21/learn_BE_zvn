const mongoose = require('mongoose');

//shape data
const demoSchema = new mongoose.Schema({
    name: String,
    ordering: Number
}, {
    timestamps: true
});

const Demo = mongoose.model('demos', demoSchema);

module.exports = Demo;
