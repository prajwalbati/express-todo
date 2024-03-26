const todoService = require("../../services/todoService");

let todoController = {
    findAllTodos: async(req, res, next) => {
        try {
            let todos = await todoService.findAll({user_id: req.user._id});
            return res.status(200).json({data: todos});
        } catch(err) {
            next(err);
        }
    },

    createTodo: async(req, res, next) => {
        try {
            let todoDetails = req.body;
            let todo = await todoService.create({title: todoDetails.title, user_id: req.user._id})
            return res.status(200).json({"message": "Todo created successfully.", data: {_id: todo._id, title: todo.title}});
        } catch(err) {
            next(err);
        }
    },

    findTodo: async(req, res, next) => {
        try {
            let todo = await todoService.findOne({ _id: req.params.id });
            if (!todo) {
                return res.status(404).json({error: 'Todo not found'});
            }
            return res.status(200).json({data: todo});
        } catch(err) {
            next(err);
        }
    },

    updateTodo: async(req, res, next) => {
        try {
            let updatedData = req.body;
            let todo = await todoService.findOne({ _id: req.params.id });
            if (!todo) {
                return res.status(404).json({error: 'Todo not found'});
            }
            await todoService.update({_id: req.params.id}, updatedData);

            return res.status(200).json({message: "Todo updated Successfully"});
        } catch(err) {
            next(err);
        }
    },

    deleteTodo: async(req, res, next) => {
        try {
            await todoService.deleteOne({_id: req.params.id});
            return res.json({message: "Todo deleted Successfully"});
        } catch(err) {
            next(err);
        }
    }
};

module.exports = todoController;