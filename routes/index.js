var express = require('express');
var router = express.Router();
let passport = require("passport");

let dashboardController = require("../controllers/dashboardController");
let userController = require("../controllers/userController");
let authController = require("../controllers/authController");
let todoController = require("../controllers/todoController");
let { createTodoValidation } = require("../validators/todoValidator");
let { createUserValidation } = require("../validators/userValidator");
let { isLoggedIn } = require("../middleware/authenticateMiddleware");


router.get('/register', authController.register);
router.post('/auth/register', [createUserValidation], authController.registerUser);
router.get('/auth/:token/verify', authController.verifyAccount);
router.get('/login', authController.loginPage);
router.post('/auth/login', async (req, res, next) => {
    await passport.authenticate('local', async(err, user, info) => {
        if (!user) {
            let msg = info && info.message ? info.message : 'Incorrect Email/Password';
            req.flash('error_msg', msg);
            return res.redirect('/login');
        }
        return req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    })(req, res, next);
});
router.get('/logout', authController.logout);


router.get('/profile', [isLoggedIn], userController.profile);

/* GET home page. */
router.get('/', [isLoggedIn], dashboardController.index);

/* GET home page. */
router.get('/todo', [isLoggedIn], todoController.findAllTodos);

// Create todo
router.post("/todo", [isLoggedIn, createTodoValidation], todoController.createTodo);

// show edit page
router.get('/todo/:id', [isLoggedIn], todoController.todoDetails);

// update single todo
router.put('/todo/:id', [isLoggedIn], [createTodoValidation], todoController.updateTodo);

// Delete single todo item
router.delete('/todo/:id', [isLoggedIn], todoController.deleteTodo);

module.exports = router;