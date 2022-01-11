var express = require('express');
var router = express.Router();

let todoController = require("../controllers/todoController");
let { createTodoValidation } = require("../validators/todoValidator");


/* GET home page. */
router.get('/', todoController.findAllTodos);

// Create todo
router.post("/todo", [createTodoValidation], todoController.createTodo);

// show edit page
router.get('/todo/:id', todoController.todoDetails);

// update single todo
router.put('/todo/:id', [createTodoValidation], todoController.updateTodo);

// Delete single todo item
router.delete('/todo/:id', todoController.deleteTodo);

module.exports = router;