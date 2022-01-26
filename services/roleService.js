let roleModel = require("../models/role");

let roleService = {
    create: async (data) => {
        let role = await roleModel(data).save();
        return role;
    },

    findOne: async (query) => {
        let role = await roleModel.findOne(query);
        return role;
    },
    findOneAndUpdate: async (query, updateData) => {
        return await roleModel.findOneAndUpdate(query, updateData);
    }
};

module.exports = roleService;