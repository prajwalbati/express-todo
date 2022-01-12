const { validationResult } = require('express-validator');
let todoService = require("../services/todoService");

let findAllTodos = async function(req, res, next) {
    let todos = await todoService.findAll({});
    res.render('todo', { title: 'My todo app', data: todos });
}

let createTodo = async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('/todo');
    }
    let { title } = req.body;
    let todoData = {
      title : title
    };
    await todoService.create(todoData);
    return res.redirect('/todo');
}

let todoDetails = async (req, res) => {
    let todoId = req.params.id;
    let todo = await todoService.findOne({_id: todoId});
    res.render('edittodo', { title: 'My todo app', todo: todo });
};

let updateTodo = async function(req, res) {
    let id = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect("/todo/"+id);
    }
    await todoService.update({_id: id},  { title : req.body.title});
    return res.redirect("/todo/"+id);
};

let deleteTodo = async function(req, res, next) {
    let todoId = req.params.id;
    await todoService.deleteOne({_id: todoId});
    res.redirect("/todo");
}

module.exports = {
    findAllTodos,
    createTodo,
    todoDetails,
    updateTodo,
    deleteTodo
};