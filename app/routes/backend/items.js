const express = require('express');
const router = express.Router();

const { validateItem } = require('./../../validates/validator');
const itemController = require('./../../controllers/itemController');

router.get('(/status/:status)?', itemController.getItemListPage);// GET users listing.
router.get('/change-status/:id/:status', itemController.getChangeStatus);//change status
router.get('/delete/:id/:status', itemController.getDeleteItem);// delete a element
router.get('/form(/:id)?', itemController.getFormPage);// Form using addPage and editPage 

router.post('/delete', itemController.postDeleteMultiItems);// delete multi elements
router.post('/change-ordering', itemController.postMultiChangeOrdering);// change multi change-ordering
router.post('/save', validateItem(), itemController.postSaveItem);// save form ---> using for edit and add item
router.post('/change-status/:status', itemController.postChangeMultiStatus);//change multi status

module.exports = router;