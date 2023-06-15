const main_Service = require("../services/items_Service");
const utilsHelpers = require('./../helpers/utils');
const systemConfig = require('./../configs/system');
const { validationResult } = require('express-validator');
const fileHelpers = require('./../helpers/file');

const main = 'items';
const linkRouteItems = `/${systemConfig.prefixAdmin}/${main}`;

const view_list = `backend/pages/${main}/list`;
const view_form = `backend/pages/${main}/form`;

module.exports = {
    getListItems: async (req, res) => {
        console.log(`-> Get-List`);
        systemConfig.viewMenuOpen = main;        // view sidebar-menu: open
        systemConfig.viewStatusActive = 'list';     // view sidebar-menu: active list

        console.log(req.session);

        const status = req.params.status ? req.params.status : 'all';
        const keyWordSearch = req.query.search ? req.query.search : '';
        const currentPage = + (req.query.page ? req.query.page : '1');
        const sort_field_name = req.session.fieldName ? req.session.fieldName : 'ordering';
        const sort_type = req.session.sortType ? req.session.sortType : 'asc';

        let sortElement = {};
        sortElement[sort_field_name] = sort_type;

        console.log("sort: ", sortElement);

        //Search config
        let filter = { "name": new RegExp(keyWordSearch, 'i') };

        //View ejs status-filter
        let statusFilter = await utilsHelpers.craeteFilterStatus(status);

        // set filter for get item
        if (status && status !== 'all') filter.status = status;

        //Pagination
        let pagination = await utilsHelpers.createPaginationItems(filter, currentPage);

        // get Items - service
        const items = await main_Service.getItems(filter, pagination, sortElement);

        console.log(items);

        let msg = req.flash("msg");

        console.log(`Page ${currentPage}`);

        // return view
        res.render(view_list, {
            title: 'List Items',
            listItems: items,
            statusFilter,
            keyWordSearch,
            status,
            msg,
            pagination,
            sort_field_name,
            sort_type
        });
    },
    getFormItems: async (req, res) => {
        console.log('-> Get-Form');
        systemConfig.viewMenuOpen = main;        // view sidebar-menu: open
        systemConfig.viewStatusActive = 'form';     // view sidebar-menu: active form

        const id = req.params.id;
        let item = { name: '', status: 'novalue', ordering: 0, image: 'Choose file' };

        let errors = null;

        if (id) item = await main_Service.getItemById(id);

        console.log(item);

        res.render(view_form, {
            title: 'Form',
            item: item,
            errors: errors
        });
    },
    getChangeStatusItem: async (req, res) => {
        console.log(`-> Get change-status by id`);

        const id = req.params.id;
        const currentStatus = req.params.currentStatus;

        try {
            if (id && currentStatus) {
                const statusNew = (currentStatus == 'active') ? 'inactive' : 'active';
                const dataUpdate = {
                    status: statusNew,
                    modified: {
                        user_id: 0,
                        user_name: "admin",
                        time: Date.now()
                    }
                }
                await main_Service.updateStatus(id, dataUpdate);
                //req.flash("msg", "status change successfull");
                res.send({ success: true, statusNew: statusNew });
            }
        } catch (error) {
            res.send({ success: false, statusNew: null });
        }
    },
    getChangeOrderingItem: async (req, res) => {
        console.log(`-> Get change-ordering by id`);

        const id = req.params.id;
        const newOrdering = + req.params.newOrdering;

        try {
            if (id && newOrdering) {
                const dataUpdate = {
                    ordering: newOrdering,
                    modified: {
                        user_id: 0,
                        user_name: 'admin',
                        time: Date.now()
                    }
                }
                await main_Service.updateItem(id, dataUpdate);
                res.send({ success: true });
            }
        } catch (error) {
            res.send({ success: false });
        }
    },
    postSaveItem: async (req, res) => {
        let item = req.body;

        const errors = validationResult(req).errors;
        console.log(`validateResult`, errors);


        if (errors.length !== 0) {
            if (req.file) fileHelpers.remove(`/public/uploads/${main}`, req.file.filename);
            res.render(view_form, {
                title: 'Form',
                item: item,
                errors: errors
            });
        } else {
            if (item.id) { //edit
                const item_old = await main_Service.getItemById(item.id);
                fileHelpers.remove(`/public/uploads/${main}`, item_old.image);
                item.image = req.file.filename;

                const dataUpdate = {
                    name: item.name,
                    status: item.status,
                    ordering: item.ordering,
                    image: item.image,
                    modified: {
                        user_id: 0,
                        user_name: "admin",
                        time: Date.now()
                    }
                }

                const resultUpdateItem = await main_Service.updateItem(item.id, dataUpdate);
                console.log(`Update item: ${resultUpdateItem}`);
                req.flash('msg', 'edit item succeed');
            } else { //add
                item.image = req.file.filename;
                item.created = {
                    user_id: 0,
                    user_name: "admin",
                    time: Date.now()
                };

                const resultCreateItem = await main_Service.postCreateItem(item);
                console.log(`Create item: ${resultCreateItem}`);
                req.flash('msg', 'create item succeed');
            }
            res.redirect(linkRouteItems);
        }
    },
    getDeleteItem: async (req, res) => {
        const id = req.params.id;

        const item = await main_Service.getItemById(id);

        console.log(item.image);

        fileHelpers.remove(`/public/uploads/${main}`, item.image)

        const result = await main_Service.deleteItemById(id);
        console.log(`delete: ${result}`);

        if (result) {
            req.flash("msg", "item deleted successfully");
            res.send({ success: true });
        } else {
            req.flash("msg", "item delete fail");
            res.send({ success: false });
        }

        // res.redirect(linkRouteItems);
    },
    postDeleteManyItems: async (req, res) => {
        const listId = req.body.cid;
        console.log(`List delete id : ${listId}`);

        const result = await main_Service.deleteManyItems(listId);
        console.log(`delete many: ${result}`);
        req.flash("msg", "multiple items deleted successfully");

        res.redirect(linkRouteItems);
    },
    postChangeManyOrdering: async (req, res) => {
        console.log(`-> Post change mul ordering`);

        const listId = req.body.cid;
        const listOrdering = req.body.ordering;
        console.log(req.body);

        let result = [];

        for (let i = 0; i < listId.length; i++) {
            result[i] = await main_Service.updateItem(listId[i], { ordering: listOrdering[i] });
        }

        console.log(`Update many: ${JSON.stringify(result)}`);
        req.flash("msg", "change mul-ordering successfull");

        res.redirect(linkRouteItems);
    },
    postChangeManyStatus: async (req, res) => {
        const listId = req.body.cid;
        const statusUpdate = req.params.status;

        const dataUpdate = {
            status: statusUpdate,
            modified: {
                user_id: 0,
                user_name: 'admin',
                time: Date.now()
            }
        }

        const result = await main_Service.updateManyStatus(listId, dataUpdate);

        console.log(`Update many status: ${result}`);
        req.flash("msg", "change mul-status successfull");

        res.redirect(linkRouteItems);
    },
    getSortField: (req, res) => {
        const field_name = req.params.field_name ? req.params.field_name : 'ordering';
        const sort_type = req.params.sort_type ? req.params.sort_type : 'asc';

        req.session.fieldName = field_name;
        req.session.sortType = sort_type;

        res.redirect(linkRouteItems);
    }
}


