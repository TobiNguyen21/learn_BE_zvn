const { validationResult } = require('express-validator');

const UtilsHelpers = require('./../helpers/utils');
const ParamsHelpers = require('./../helpers/params');
const systemConfig = require('./../configs/system');
const items_Service = require('../services/items_Service');

const linkIndex = `/${systemConfig.prefixAdmin}/items/`;
const pageTitleIndex = 'Item Management';
const pageTitleAdd = pageTitleIndex + ' - Add';
const pageTitleEdit = pageTitleIndex + ' - Edit';
const folderView = 'pages/items';

module.exports = {
    getItemListPage: async (req, res, next) => {
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

        pagination.totalItems = await items_Service.getCountItems(filter);
        pagination.totalPages = Math.ceil(pagination.totalItems / pagination.limit);

        let items = await items_Service.getItems(filter, offset, pagination.limit);

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
    },
    getChangeStatus: async (req, res) => {
        let currentStatus = ParamsHelpers.getParamStatus(req.params, 'status', 'active');
        let id = ParamsHelpers.getParamStatus(req.params, 'id', '');

        let status = currentStatus === 'active' ? 'inactive' : 'active';

        let currentPage = +ParamsHelpers.getParamStatus(req.query, 'page', '1');

        try {
            const result = await items_Service.updateItem(id, { status: status });
            console.log(`update success ${JSON.stringify(result)}`);
            req.flash('message', 'change status success');
        } catch (error) {
            req.flash('message', 'change status fail');
            console.log(error);
        }

        console.log(currentStatus, id);
        res.redirect(linkIndex + `status/all?page=${currentPage}`);
    },
    postChangeMultiStatus: async (req, res) => {
        let currentStatus = ParamsHelpers.getParamStatus(req.params, 'status', 'active');
        let listId = req.body.cid;
        // console.log(`listId ${listId}`);

        try {
            const result = await items_Service.updateMultiItems(listId, { status: currentStatus });
            req.flash('message', 'change multiple status succeed');
        } catch (error) {
            req.flash('message', 'change multiple status failed');
            console.log(error);
        }

        res.redirect(linkIndex + `status/all?page=1`);
    },
    getDeleteItem: async (req, res) => {
        let currentStatus = ParamsHelpers.getParamStatus(req.params, 'status', 'active');
        let currentPage = +ParamsHelpers.getParamStatus(req.query, 'page', '1');
        let id = ParamsHelpers.getParamStatus(req.params, 'id', '');

        try {
            const result = await items_Service.deleteItem(id);
            req.flash('message', 'deleted element succeed');
        } catch (error) {
            req.flash('message', 'deleted element failed');
            console.log(error);
        }

        res.redirect(linkIndex + `status/${currentStatus}?page=${currentPage}`);
    },
    postDeleteMultiItems: async (req, res) => {
        const listId = req.body.cid;
        console.log(`listID: ${listId}`);
        try {
            const result = await items_Service.deleteMultiItems(listId);
            req.flash('message', 'deleted multiple element succeed');
        } catch (error) {
            req.flash('message', 'deleted multiple element failed');
            console.log(error);
        }
        res.redirect(linkIndex);
    },
    postMultiChangeOrdering: async (req, res) => {
        let listId = Array.isArray(req.body.cid) ? req.body.cid : [req.body.cid];
        let orderings = Array.isArray(req.body.ordering) ? req.body.ordering : [req.body.ordering];

        orderings.forEach((element, index) => {
            orderings[index] = +element;
        });

        console.log(listId);
        console.log(orderings);

        let countError = 0;


        for (let i = 0; i < listId.length; i++) {
            try {
                await items_Service.updateItem(listId[i], { ordering: orderings[i] });
            } catch (error) {
                countError++;
                console.log(error);
            }
        }

        if (countError === 0) req.flash('message', 'change multi ordering succeed');
        else req.flash('message', 'change multi ordering failed');

        res.redirect(linkIndex);
    },
    getFormPage: async (req, res, next) => {
        const id = ParamsHelpers.getParamStatus(req.params, 'id', '');
        let item = { name: '', ordering: 0, status: 'novalue' };
        let errors = null;
        if (id) {
            item = await items_Service.getItemById(id);
            res.render(`${folderView}/form`, { pageTitle: pageTitleEdit, item, errors });
        }
        res.render(`${folderView}/form`, { pageTitle: pageTitleAdd, item, errors });
    },
    postSaveItem: async (req, res) => {
        const item = req.body;

        const errors = validationResult(req).errors;
        console.log(`ERR: `, errors);

        if (item.id) { // Edit
            if (errors.length !== 0) {
                res.render(`${folderView}/form`, { pageTitle: pageTitleEdit, item, errors });
            } else {
                console.log(`Data Edit: `, item);
                await items_Service.updateItem(item.id, { name: item.name, ordering: item.ordering, status: item.status });
                req.flash('message', 'edit item succeed');
            }
        } else { //Add
            if (errors.length !== 0) {
                res.render(`${folderView}/form`, { pageTitle: pageTitleAdd, item, errors });
            } else {
                delete item.id;
                console.log(`Data Add: `, item);
                await items_Service.createItem(item);
                req.flash('message', 'add new item succeed');
            }
        }
        res.redirect(linkIndex);
    }
}