const fs = require("fs");
const Item = require("./../models/item");
module.exports = {
    // Interact JSON file
    getAll_ItemsJSON: () => {
        try {
            const dataString = fs.readFileSync('./items.json', "utf-8");
            const items = JSON.parse(dataString);
            return items;
        } catch (error) {
            console.log(`Get all items from items.json fail: ${error}`);
            return null;
        }
    },
    getOne_ItemJSON: (id) => {
        try {
            const dataString = fs.readFileSync('./items.json', "utf-8");
            const items = JSON.parse(dataString);
            const item = items.find((item) => item.id == id);
            return item;
        } catch (error) {
            console.log(`Get item from items.json fail: ${error}`);
            return null;
        }
    },
    postCreate_ItemJSON: ({ name, status }) => {
        try {
            const dataString = fs.readFileSync('./items.json', 'utf-8');
            const items = JSON.parse(dataString);
            const id = `${items.length + 1}`; // auto generate id for item
            items.push({ id, name, status });
            fs.writeFileSync('./items.json', JSON.stringify(items), 'utf-8');
            return items;
        } catch (error) {
            console.log(`Post new item to items.json fail: ${error}`);
            return null;
        }
    },
    deleteById_ItemJSON: (id) => {
        try {
            const dataString = fs.readFileSync('./items.json', 'utf-8');
            const items = JSON.parse(dataString);
            const itemsAfterDelete = items.filter((item) => item.id !== id);
            fs.writeFileSync('./items.json', JSON.stringify(itemsAfterDelete), 'utf-8');
            return itemsAfterDelete;
        } catch (error) {
            console.log(`Delete item from items.json fail: ${error}`);
            return null;
        }
    },
    // Interact Mongodb
    getItems: async (filter, { offset, limit }, sortElement) => {
        try {
            return await Item.find(filter).sort(sortElement).skip(offset).limit(limit);
        } catch (error) {
            console.log(`Get items fail: ${error}`);
            return null;
        }
    },
    getItemById: async (id) => {
        try {
            return await Item.findById(id);
        } catch (error) {
            console.log(`Get data fail: ${error}`);
            return null;
        }
    },
    deleteItemById: async (id) => {
        try {
            return await Item.deleteOne({ _id: id });
        } catch (error) {
            console.log(`Delete data fail: ${error}`);
            return null;
        }
    },
    deleteManyItems: async (listId) => {
        try {
            return await Item.deleteMany({ _id: listId });
        } catch (error) {
            console.log(`Delete many items err: ${error}`);
            return null;
        }
    },
    postCreateItem: async ({ name, status, ordering, image, created }) => {
        try {
            return await Item.create({ name, status, ordering, image, created });
        } catch (error) {
            console.log(`Create data fail: ${error}`);
            return null;
        }
    },
    updateItem: async (id, dataUpdate) => {
        try {
            return await Item.updateOne({ _id: id }, dataUpdate);
        } catch (error) {
            console.log(`Update item fail: ${error}`);
            return null;
        }
    },
    updateManyStatus: async (listId, dataUpdate) => {
        try {
            return await Item.updateMany({ _id: listId }, dataUpdate);
        } catch (error) {
            console.log(`Update many status err: ${error}`);
        }
    },
    updateStatus: async (id, dataUpdate) => {
        try {
            return await Item.updateOne({ _id: id }, dataUpdate);
        } catch (error) {
            console.log(`Update status fail: ${error}`);
            return null;
        }
    },
    countItems: async (filter) => {
        try {
            return await Item.count(filter);
        } catch (error) {
            console.log(`count items err: ${error}`);
            return 0;
        }
    },
    countItemsByStatus: async (status) => {
        const filter = (status !== 'all') ? { status: status } : {};
        try {
            return await Item.count(filter);
        } catch (error) {
            console.log(`Err count items by status: ${error}`);
            return 0;
        }
    }
}