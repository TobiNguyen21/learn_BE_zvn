const express = require('express');
const router = express.Router();

const Item = require('./../../schemas/items');
const UtilsHelpers = require('./../../helpers/utils');
const ParamsHelpers = require('./../../helpers/params');
const systemConfig = require('./../../configs/system');

const linkIndex = `/${systemConfig.prefixAdmin}/items/`;

/* GET users listing. */
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

    res.render('pages/items/list.ejs', {
        pageTitle: 'Item List Page',
        items: items,
        statusFilter: statusFilter,
        currentStatus: currentStatus,
        keyWordSearch: keyWordSearch,
        pagination: pagination
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
        console.log(result);
    } catch (error) {
        console.log(error);
    }

    console.log(currentStatus, id);
    res.redirect(linkIndex + `status/all?page=${currentPage}`);
});

//change multi status
router.post('/change-status/:status', async (req, res) => {
    let currentStatus = ParamsHelpers.getParamStatus(req.params, 'status', 'active');
    let listId = req.body.cid;

    try {
        const result = await Item.updateMany({ _id: listId }, { status: currentStatus });
        console.log(result);
    } catch (error) {
        console.log(error);
    }

    console.log(listId);
    res.redirect(linkIndex + `status/all?page=1`);
});


router.get('/delete/:id/:status', async (req, res) => {
    let currentStatus = ParamsHelpers.getParamStatus(req.params, 'status', 'active');
    let currentPage = +ParamsHelpers.getParamStatus(req.query, 'page', '1');
    let id = ParamsHelpers.getParamStatus(req.params, 'id', '');

    try {
        const result = await Item.deleteOne({ _id: id });
        console.log(result);
    } catch (error) {
        console.log(error);
    }

    res.redirect(linkIndex + `status/${currentStatus}?page=${currentPage}`);
});


router.get('/add', (req, res, next) => {
    res.render('pages/items/add.ejs', { pageTitle: 'Item Add Page' });
});

module.exports = router;