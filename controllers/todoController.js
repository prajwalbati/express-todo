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
    await todoService.create(todoData);
    res.redirect('/');
}

let todoDetails = async (req, res) => {
    let todoId = req.params.id;
    let todo = await todoService.findOne({_id: todoId});
    res.render('edittodo', { title: 'My todo app', todo: todo });
};

let updateTodo = async function(req, res) {
    let id = req.params.id;
    await todoService.update({_id: id},  { title : req.body.title});
    res.redirect("/todo/"+id);
};

let deleteTodo = async function(req, res, next) {
    let todoId = req.params.id;
    await todoService.deleteOne({_id: todoId});
    res.redirect("/");
}

module.exports = {
    findAllTodos,
    createTodo,
    todoDetails,
    updateTodo,
    deleteTodo
};