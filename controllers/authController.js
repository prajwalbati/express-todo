let userService = require("../services/userService");

let register = (req, res, next) => {
    return res.render('auth/register');
};

let registerUser = async (req, res, next) => {
    try {
        let userData = req.body;

        let password = userData.password;
        await userService.create(userData);
        req.flash("success_msg", "User registered successfully. Please check your email to activate your account.")
        return res.redirect("/register");
    } catch (err) {
        req.flash("error_msg", err.message);
        return res.redirect("/register");
    }

};

module.exports = { register, registerUser };