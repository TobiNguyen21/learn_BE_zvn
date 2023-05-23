const express = require('express');
const router = express.Router();

const Item = require('./../../schemas/items');
const UtilsHelpers = require('./../../helpers/utils');
const ParamsHelpers = require('./../../helpers/params');
const systemConfig = require('./../../configs/system');
const { updateOne } = require('./../../schemas/items');

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
    // console.log(`listId ${listId}`);

    try {
        const result = await Item.updateMany({ _id: listId }, { status: currentStatus });
        console.log(result);
    } catch (error) {
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
        console.log(result);
    } catch (error) {
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
        console.log(result);
    } catch (error) {
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

    await listId.forEach(async (id, index) => {
        try {
            await Item.updateOne({ _id: id }, { ordering: orderings[index] });
        } catch (error) {
            console.log(error);
        }
    });

    res.redirect(linkIndex);
});


router.get('/add', (req, res, next) => {
    res.render('pages/items/add.ejs', { pageTitle: 'Item Add Page' });
});

module.exports = router;