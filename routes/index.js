var express = require('express');
var router = express.Router();

let dashboardController = require("../controllers/dashboardController");
let authController = require("../controllers/authController");
let todoController = require("../controllers/todoController");
let { createTodoValidation } = require("../validators/todoValidator");
let { createUserValidation } = require("../validators/userValidator");


router.get('/register', authController.register);
router.post('/auth/register', [createUserValidation], authController.registerUser);

router.get('/auth/:token/verify', authController.verifyAccount);


/* GET home page. */
router.get('/', dashboardController.index);

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