let userService = require("../services/userService")

let userController = {
    profile: async (req, res, next) => {
        let user = await userService.findOne({_id: req.user.id});
        return res.render("profile", {user});
    }
};

module.exports = userController;