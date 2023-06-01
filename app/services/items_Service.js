const Item = require('./../schemas/items');

module.exports = {
    createItem: async (item) => {
        try {
            return Item.create(item);
        } catch (error) {
            console.log(`create item err: ${error}`);
            return null;
        }
    },
    getItems: async (filter, offset, limit) => {
        try {
            return await Item.find(filter).sort({ ordering: 'asc' }).skip(offset).limit(limit);
        } catch (error) {
            console.log(`get items err: ${error}`);
            return null;
        }
    },
    getItemById: async (id) => {
        try {
            return await Item.findById(id);
        } catch (error) {
            console.log(`get item by id err: ${error}`);
            return null;
        }
    },
    getCountItems: async (filter) => {
        try {
            return await Item.count(filter);
        } catch (error) {
            console.log(`count items err: ${error}`);
            return 0;
        }
    },
    updateItem: async (id, update) => {
        try {
            return await Item.updateOne({ _id: id }, update);
        } catch (error) {
            console.log(`update item err: ${error}`);
            return null;
        }
    },
    updateMultiItems: async (listId, update) => {
        try {
            return await Item.updateMany({ _id: listId }, update);
        } catch (error) {
            console.log(`update multiple items err: ${error}`);
            return null;
        }
    },
    deleteItem: async (id) => {
        try {
            return await Item.deleteOne({ _id: id });
        } catch (error) {
            console.log(`delete item err: ${error}`);
            return null;
        }
    },
    deleteMultiItems: async (listId) => {
        try {
            return await Item.deleteMany({ _id: listId });
        } catch (error) {
            console.log(`delete multiple items err: ${error}`);
            return null;
        }
    }
}