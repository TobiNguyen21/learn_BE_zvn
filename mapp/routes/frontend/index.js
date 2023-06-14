const express = require('express');
const router = express.Router();

// LINK: localhost/

// Middleware sử dụng express-ejs-layouts cho phần frontend
router.use('/', (req, res, next) => {
    //console.log(`-> set layout frontend`);
    req.app.set('layout', 'frontend/index.ejs');
    next();
});

router.use('/', require('./home'));

module.exports = router;
