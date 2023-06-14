const express = require('express');
const routerAPI = express.Router();
const api_Items_Controller = require('../../controllers/api_items_Controller');

// localhost/api/items

// Interact JSON file
routerAPI.get('/json', api_Items_Controller.getAll_ItemsJSON_API);
routerAPI.get('/json/:id', api_Items_Controller.getOne_ItemsJSON_API);
routerAPI.post('/json', api_Items_Controller.postCreate_ItemsJSON_API);
routerAPI.delete('/json/:id', api_Items_Controller.deleteById_ItemsJSON_API);

// Interact Mongodb
routerAPI.get('/', api_Items_Controller.getAllItemsAPI);
routerAPI.get('/:id', api_Items_Controller.getItemByIdAPI);
routerAPI.post('/', api_Items_Controller.postCreateItemAPI);
routerAPI.delete('/:id', api_Items_Controller.deleteItemByIdAPI);
routerAPI.put('/', api_Items_Controller.putUpdateItemAPI);

module.exports = routerAPI;