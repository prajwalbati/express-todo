var express = require('express');
var router = express.Router();
let passport = require("passport");

let dashboardController = require("../controllers/dashboardController");
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
        if (user) {
            req.session.user = user;
            return res.redirect('/');
        } else {
            let msg = info && info.message ? info.message : 'Incorrect Email/Password';
            req.flash('error_msg', msg);
            return res.redirect('/login');
        }
    })(req, res, next);
});


/* GET home page. */
router.get('/', [isLoggedIn], dashboardController.index);

/* GET home page. */
router.get('/todo', todoController.findAllTodos);

// Create todo
router.post("/todo", [createTodoValidation], todoController.createTodo);

// show edit page
router.get('/todo/:id', todoController.todoDetails);

// update single todo
router.put('/todo/:id', [createTodoValidation], todoController.updateTodo);

// Delete single todo item
router.delete('/todo/:id', todoController.deleteTodo);

module.exports = router;