const express = require('express');
const routerAPI = express.Router();

routerAPI.use('/items', require('./items_api'));


module.exports = routerAPI;