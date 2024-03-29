const { validationResult } = require('express-validator');
let todoService = require("../services/todoService");

let findAllTodos = async function(req, res, next) {
    let todos = await todoService.findAll({user_id: req.user._id});
    res.render('dashboard', { data: todos });
}

let createTodo = async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('/dashboard');
    }
    let { title } = req.body;
    let todoData = {
      title : title,
      user_id: req.user._id
    };
    await todoService.create(todoData);
    req.flash('success_msg', "Todo created successfully.");
    return res.redirect('/dashboard');
}

let todoDetails = async (req, res) => {
    let todoId = req.params.id;
    let todo = await todoService.findOne({_id: todoId});
    res.render('edittodo', { title: 'My todo app', todo: todo });
};

let updateTodo = async function(req, res) {
    let id = req.params.id;
    await todoService.update({_id: id},  { is_completed : !!req.body.is_completed});
    req.flash('success_msg', "Todo updated successfully.");
    return res.redirect("/dashboard");
};

let deleteTodo = async function(req, res, next) {
    let todoId = req.params.id;
    await todoService.deleteOne({_id: todoId});
    req.flash('success_msg', "Todo deleted successfully.");
    res.redirect("/dashboard");
}

module.exports = {
    findAllTodos,
    createTodo,
    todoDetails,
    updateTodo,
    deleteTodo
};