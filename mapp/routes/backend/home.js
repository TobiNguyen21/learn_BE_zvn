const express = require('express');
const router = express.Router();
const systemConfig = require('./../../configs/system');

// LINK: localhost/admin/(home)?

/* GET home page. */
router.get('/', (req, res) => {
    console.log(`Homepage`);
    systemConfig.viewMenuOpen = '';
    systemConfig.viewStatusActive = '';
    res.render('backend/pages/home/index', {
        title: 'Home',
        addClassElement: { menu: '', statusItem: 'inactive', statusList: 'inactive', statusForm: 'inactive' }
    });
});

module.exports = router;