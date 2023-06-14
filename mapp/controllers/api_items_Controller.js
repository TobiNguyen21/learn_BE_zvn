const items_Service = require('../services/items_Service');
module.exports = {
    // Interact JSON file
    getAll_ItemsJSON_API: async (req, res) => {
        const items = await items_Service.getAll_ItemsJSON();
        res.send(items);
    },
    getOne_ItemsJSON_API: async (req, res) => {
        const id = req.params.id;
        const item = await items_Service.getOne_ItemJSON(id);
        res.send(item);
    },
    postCreate_ItemsJSON_API: async (req, res) => {
        const { name, status } = req.body;
        const item = await items_Service.postCreate_ItemJSON({ name, status });
        res.send(item);
    },
    deleteById_ItemsJSON_API: async (req, res) => {
        const id = req.params.id;
        console.log(`ID delete: ${id}`);
        const items = await items_Service.deleteById_ItemJSON(id);
        res.send(items);
    },
    // Interact Mongodb
    getAllItemsAPI: async (req, res) => {
        const items = await items_Service.getAllItems();
        if (items) {
            res.status(200).json({
                status: 'success',
                data: items
            });
        } else {
            res.status(200).json({
                status: 'failed',
                data: items
            });
        }
    },
    getItemByIdAPI: async (req, res) => {
        const id = req.params.id;
        const item = await items_Service.getItemById(id);
        if (item) {
            res.status(200).json({
                status: 'success',
                data: item
            });
        } else {
            res.status(200).json({
                status: 'failed',
                data: item
            });
        }

    },
    postCreateItemAPI: async (req, res) => {
        const { name, status, ordering } = req.body;
        const itemNew = await items_Service.postCreateItem({ name, status, ordering });
        if (itemNew) {
            res.status(200).json({
                status: 'success',
                data: itemNew
            });
        } else {
            res.status(200).json({
                status: 'failed',
                data: itemNew
            });
        }
    },
    deleteItemByIdAPI: async (req, res) => {
        const id = req.params.id;
        const result = await items_Service.deleteItemById(id);
        if (result) {
            res.status(200).json({
                status: 'success',
                data: result
            });
        } else {
            res.status(200).json({
                status: 'failed',
                data: result
            });
        }
    },
    putUpdateItemAPI: async (req, res) => {
        const { id, name, status, ordering } = req.body;
        const result = await items_Service.putUpdateItem({ id, name, status, ordering });
        if (result) {
            res.status(200).json({
                status: 'success',
                data: result
            });
        } else {
            res.status(200).json({
                status: 'failed',
                data: result
            });
        }
    }
}