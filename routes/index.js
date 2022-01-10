var express = require('express');
var router = express.Router();

let todoController = require("../controllers/todoController");


/* GET home page. */
router.get('/', todoController.findAllTodos);

// Create todo
router.post("/todo", todoController.createTodo);

// show edit page
router.get('/todo/:id', todoController.todoDetails);

// update single todo
router.put('/todo/:id', todoController.updateTodo);

// Delete single todo item
router.delete('/todo/:id', todoController.deleteTodo);

module.exports = router;