let userModel = require("../models/user");

let userService = {
    create: async (data) => {
        return await userModel(data).save();
    },

    findOne: async (query) => {
        let user = await userModel.findOne(query);
        return user;
    },
    findOneAndUpdate: async (query, updateData) => {
        return await userModel.findOneAndUpdate(query, updateData);
    }
};

module.exports = userService;