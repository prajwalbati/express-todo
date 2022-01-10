let todoModel = require("../models/todo");
let todoService = require("../services/todoService");

let findAllTodos = async function(req, res, next) {
    let todos = await todoService.findAll({});
    res.render('index', { title: 'My todo app', data: todos });
}

let createTodo = async function(req, res, next) {
    let { title } = req.body;
    let todoData = {
      title : title
    };
    await todoModel(todoData).save();
    res.redirect('/');
  }

let deleteTodo = async function(req, res, next) {
    let todoId = req.params.id;
    await todoModel.deleteOne({_id: todoId});
    res.redirect("/");
  }

module.exports = {
    findAllTodos,
    createTodo,
    deleteTodo
};