const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(`-> get frontend view`);
  res.render('frontend/index');
});

module.exports = router;
