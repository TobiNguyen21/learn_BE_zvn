const express = require('express');
const router = express.Router();

const main_Controller = require('../../controllers/groups_Controller');
const validateGroup = require('../../validates/groups');

const fileHelpers = require('../../helpers/file');

// LINK: localhost/admin/items

/* GET list Items. */
router.get('(/status/:status)?', main_Controller.getListItems);
router.get('/form(/:id)?', main_Controller.getFormItems);
// router.get('/change-status/:id/:currentStatus', main_Controller.getChangeStatusItem);

router.get('/change-status-ajax/:id/:currentStatus', main_Controller.getChangeStatusItem);
router.get('/change-ordering-ajax/:id/:newOrdering', main_Controller.getChangeOrderingItem);
router.get('/delete/:id', main_Controller.getDeleteItem);

router.post('/save', fileHelpers.upload('image', 'groups'), validateGroup.validator(), main_Controller.postSaveItem);

router.post('/delete', main_Controller.postDeleteManyItems);// delete Many elements
router.post('/change-ordering', main_Controller.postChangeManyOrdering);// change Many change-ordering
router.post('/change-status/:status', main_Controller.postChangeManyStatus);//change Many status
// router.post('/upload-file', main_Controller.postUploadSingleFile);

router.get('/sort/:field_name/:sort_type', main_Controller.getSortField);

module.exports = router;