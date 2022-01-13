let userModel = require("../models/user");

let userService = {
    create: async (data) => {
        await userModel(data).save();
        return;
    }
};

module.exports = userService;