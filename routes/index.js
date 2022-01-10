var express = require('express');
var router = express.Router();

let todoModel = require("../models/todo");
let todoController = require("../controllers/todoController");

/* GET home page. */
router.get('/', todoController.findAllTodos);

// Create todo
router.post("/todo", todoController.createTodo);

// Delete single todo item
router.delete('/todo/:id', todoController.deleteTodo);

// show edit page
router.get('/todo/:id', async function(req, res, next) {
  let todoId = req.params.id;
  let todo = await todoModel.findOne({_id: todoId});
  res.render('edittodo', { title: 'My todo app', todo: todo });
});

// update single todo
router.put('/todo/:id', async function(req, res) {
  let id = req.params.id;
  await todoModel.findOneAndUpdate({_id: id},  { title : req.body.title});
  res.redirect("/todo/"+id);
});


module.exports = router;
