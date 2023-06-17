const Group = require("../models/group");
module.exports = {
    // Interact Mongodb
    getItems: async (filter, { offset, limit }, sortElement) => {
        try {
            return await Group.find(filter).sort(sortElement).skip(offset).limit(limit);
        } catch (error) {
            console.log(`Get items fail: ${error}`);
            return null;
        }
    },
    getItemById: async (id) => {
        try {
            return await Group.findById(id);
        } catch (error) {
            console.log(`Get data fail: ${error}`);
            return null;
        }
    },
    deleteItemById: async (id) => {
        try {
            return await Group.deleteOne({ _id: id });
        } catch (error) {
            console.log(`Delete data fail: ${error}`);
            return null;
        }
    },
    deleteManyItems: async (listId) => {
        try {
            return await Group.deleteMany({ _id: listId });
        } catch (error) {
            console.log(`Delete many items err: ${error}`);
            return null;
        }
    },
    postCreateItem: async ({ name, status, ordering, image, created }) => {
        try {
            return await Group.create({ name, status, ordering, image, created });
        } catch (error) {
            console.log(`Create data fail: ${error}`);
            return null;
        }
    },
    updateItem: async (id, dataUpdate) => {
        try {
            return await Group.updateOne({ _id: id }, dataUpdate);
        } catch (error) {
            console.log(`Update item fail: ${error}`);
            return null;
        }
    },
    updateManyStatus: async (listId, dataUpdate) => {
        try {
            return await Group.updateMany({ _id: listId }, dataUpdate);
        } catch (error) {
            console.log(`Update many status err: ${error}`);
        }
    },
    updateStatus: async (id, dataUpdate) => {
        try {
            return await Group.updateOne({ _id: id }, dataUpdate);
        } catch (error) {
            console.log(`Update status fail: ${error}`);
            return null;
        }
    },
    countItems: async (filter) => {
        try {
            return await Group.count(filter);
        } catch (error) {
            console.log(`count items err: ${error}`);
            return 0;
        }
    },
    countItemsByStatus: async (status) => {
        const filter = (status !== 'all') ? { status: status } : {};
        try {
            return await Group.count(filter);
        } catch (error) {
            console.log(`Err count items by status: ${error}`);
            return 0;
        }
    }
}