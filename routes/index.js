var express = require('express');
var router = express.Router();
let passport = require("passport");

let userController = require("../controllers/userController");
let authController = require("../controllers/authController");
let todoController = require("../controllers/todoController");
let { createTodoValidation } = require("../validators/todoValidator");
let { createUserValidation } = require("../validators/userValidator");
let { isLoggedIn } = require("../middleware/authenticateMiddleware");

router.get('/', (req, res) => {
    return res.render('index');
});

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
        return req.logIn(user, async function(err) {
            if (err) { return next(err); }
            return res.redirect('/dashboard');
        });
    })(req, res, next);
});
router.get('/logout', authController.logout);


router.get('/profile', [isLoggedIn], userController.profile);
router.get('/profile/edit', [isLoggedIn], userController.editProfile);
router.post('/profile/update', [isLoggedIn], userController.updateProfile);

router.get('/dashboard', [isLoggedIn], todoController.findAllTodos);

router.post("/todos", [isLoggedIn, createTodoValidation], todoController.createTodo);
router.get('/todos/:id', isLoggedIn, todoController.todoDetails);
router.put('/todos/:id', [isLoggedIn], todoController.updateTodo);
router.delete('/todos/:id', [isLoggedIn], todoController.deleteTodo);


router.get("/403", (req, res, next) => {
    return res.render("error/403");
});

module.exports = router;