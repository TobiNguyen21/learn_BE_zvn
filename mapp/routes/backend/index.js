const express = require('express');
const router = express.Router();

// LINK: localhost/admin

// Middleware sử dụng express-ejs-layouts cho phần backend
router.use('/', (req, res, next) => {
  //console.log(`-> Set layout backend`);
  req.app.set('layout', 'backend/index.ejs');
  next();
});

router.use('/dashboard', require('./dashboard'));
router.use('(/home)?', require('./home'));
router.use('/items', require('./items'));

router.use('/demo', require('./demo/demo'));


module.exports = router;
