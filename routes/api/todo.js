const express = require('express');

const todoController = require('../../controllers/api/todoController');
const { createTodoValidation } = require("../../validators/todoValidator");

const router = express.Router();

router.get('/', todoController.findAllTodos);
router.post('/create', createTodoValidation, todoController.createTodo);
router.get('/:id', todoController.findTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;