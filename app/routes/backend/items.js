const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const Item = require('./../../schemas/items');
const UtilsHelpers = require('./../../helpers/utils');
const ParamsHelpers = require('./../../helpers/params');
const systemConfig = require('./../../configs/system');
const { validateItem } = require('./../../validates/validator');

const linkIndex = `/${systemConfig.prefixAdmin}/items/`;
const pageTitleIndex = 'Item Management';
const pageTitleAdd = pageTitleIndex + ' - Add';
const pageTitleEdit = pageTitleIndex + ' - Edit';
const folderView = 'pages/items';

// GET users listing. 
router.get('(/status/:status)?', async (req, res, next) => {
    let keyWordSearch = ParamsHelpers.getParamStatus(req.query, 'keyWordSearch', '');
    let currentStatus = ParamsHelpers.getParamStatus(req.params, 'status', 'all');
    let currentPage = +ParamsHelpers.getParamStatus(req.query, 'page', '1');
    //let limit = +ParamsHelpers.getParamStatus(req.query, 'limit', '0');

    //console.log(currentStatus);

    let pagination = {
        totalItems: 1,
        totalPages: 1,
        limit: 5,
        currentPage: currentPage,
        pageRanges: 5
    };

    let offset = (pagination.currentPage - 1) * pagination.limit;

    let keyWord = new RegExp(keyWordSearch, 'i');
    let filter = { name: keyWord };// when currentStatus = all
    if (currentStatus !== 'all') filter.status = currentStatus;

    pagination.totalItems = await Item.count(filter);
    pagination.totalPages = Math.ceil(pagination.totalItems / pagination.limit);
    let items = await Item.find(filter).sort({ ordering: 'asc' }).skip(offset).limit(pagination.limit);
    let statusFilter = await UtilsHelpers.craeteFilterStatus(currentStatus);

    let message = req.flash('message');
    //console.log(`message: ${message.length}`);

    res.render(`${folderView}/list.ejs`, {
        pageTitle: 'Item List Page',
        items: items,
        statusFilter: statusFilter,
        currentStatus: currentStatus,
        keyWordSearch: keyWordSearch,
        pagination: pagination,
        message: message
    });
});

//change status
router.get('/change-status/:id/:status', async (req, res) => {
    let currentStatus = ParamsHelpers.getParamStatus(req.params, 'status', 'active');
    let id = ParamsHelpers.getParamStatus(req.params, 'id', '');

    let status = currentStatus === 'active' ? 'inactive' : 'active';

    let currentPage = +ParamsHelpers.getParamStatus(req.query, 'page', '1');

    try {
        const result = await Item.updateOne({ _id: id }, { status: status });
        req.flash('message', 'change status success');
    } catch (error) {
        req.flash('message', 'change status fail');
        console.log(error);
    }

    console.log(currentStatus, id);
    res.redirect(linkIndex + `status/all?page=${currentPage}`);
});

//change multi status
router.post('/change-status/:status', async (req, res) => {
    let currentStatus = ParamsHelpers.getParamStatus(req.params, 'status', 'active');
    let listId = req.body.cid;
    // console.log(`listId ${listId}`);

    try {
        const result = await Item.updateMany({ _id: listId }, { status: currentStatus });
        req.flash('message', 'change multiple status succeed');
    } catch (error) {
        req.flash('message', 'change multiple status failed');
        console.log(error);
    }

    res.redirect(linkIndex + `status/all?page=1`);
});

// delete a element
router.get('/delete/:id/:status', async (req, res) => {
    let currentStatus = ParamsHelpers.getParamStatus(req.params, 'status', 'active');
    let currentPage = +ParamsHelpers.getParamStatus(req.query, 'page', '1');
    let id = ParamsHelpers.getParamStatus(req.params, 'id', '');

    try {
        const result = await Item.deleteOne({ _id: id });
        req.flash('message', 'deleted element succeed');
    } catch (error) {
        req.flash('message', 'deleted element failed');
        console.log(error);
    }

    res.redirect(linkIndex + `status/${currentStatus}?page=${currentPage}`);
});

// delete multi elements
router.post('/delete', async (req, res) => {
    const listId = req.body.cid;
    console.log(`listID: ${listId}`);
    try {
        const result = await Item.deleteMany({ _id: listId });
        req.flash('message', 'deleted multiple element succeed');
    } catch (error) {
        req.flash('message', 'deleted multiple element failed');
        console.log(error);
    }
    res.redirect(linkIndex);
});

// change multi change-ordering
router.post('/change-ordering', async (req, res) => {
    let listId = Array.isArray(req.body.cid) ? req.body.cid : [req.body.cid];
    let orderings = Array.isArray(req.body.ordering) ? req.body.ordering : [req.body.ordering];

    orderings.forEach((element, index) => {
        orderings[index] = +element;
    });

    console.log(listId);
    console.log(orderings);

    let countError = 0;

    await listId.forEach(async (id, index) => {
        try {
            await Item.updateOne({ _id: id }, { ordering: orderings[index] });
        } catch (error) {
            countError++;
            console.log(error);
        }
    });

    if (countError === 0) req.flash('message', 'change multi ordering succeed');
    else req.flash('message', 'change multi ordering failed');

    res.redirect(linkIndex);
});

// Form using addPage and editPage 
router.get('/form(/:id)?', async (req, res, next) => {
    const id = ParamsHelpers.getParamStatus(req.params, 'id', '');
    let item = { name: '', ordering: 0, status: 'novalue' };
    let errors = null;
    if (id) {
        item = await Item.findById(id);
        res.render(`${folderView}/form`, { pageTitle: pageTitleEdit, item, errors });
    }
    res.render(`${folderView}/form`, { pageTitle: pageTitleAdd, item, errors });
});

// save form ---> using for edit and add item
router.post('/save', validateItem(), async (req, res) => {
    const item = req.body;

    const errors = validationResult(req).errors;
    console.log(`ERR: `, errors);


    if (item.id) { // Edit
        if (errors.length !== 0) {
            res.render(`${folderView}/form`, { pageTitle: pageTitleEdit, item, errors });
        } else {
            console.log(`Data Edit: `, item);
            await Item.updateOne({ _id: item.id }, { name: item.name, ordering: item.ordering, status: item.status });
            req.flash('message', 'edit item succeed');
        }

    } else { //Add
        if (errors.length !== 0) {
            res.render(`${folderView}/form`, { pageTitle: pageTitleAdd, item, errors });
        } else {
            delete item.id;
            console.log(`Data Add: `, item);
            await Item.create(item);
            req.flash('message', 'add new item succeed');
        }
    }
    res.redirect(linkIndex);
});

module.exports = router;