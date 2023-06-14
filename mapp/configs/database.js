require('dotenv').config();
const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect(process.env.DB_HOST);
        console.log(`CONNECTED SUCCESS MONGODB`);
    } catch (error) {
        console.log(`CONNECTED FAIL MONGODB`);
        console.log(error);
    }
};

module.exports = connection;