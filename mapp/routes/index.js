const express = require('express');
const router = express.Router();

const systemConfig = require('./../configs/system');

// LINK: localhost/
router.use('/', require('./frontend/index'));// route to frontend
router.use(`/${systemConfig.prefixAdmin}`, require('./backend/index'));// route to backend
router.use('/api', require('./api/index'));// route to api


module.exports = router;
