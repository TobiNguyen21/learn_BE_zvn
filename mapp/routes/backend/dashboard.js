const express = require('express');
const router = express.Router();

// LINK: localhost/admin/dashboard

/* GET home page. */
router.get('/', (req, res) => {
    console.log('aloalo');
    res.render('backend/pages/dashboard/index', {
        title: 'Dashboard',
        addClassElement: { menu: '', statusItem: 'inactive', statusList: 'inactive', statusForm: 'inactive' }
    });
});

module.exports = router;