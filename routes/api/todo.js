const express = require('express');

let todoService = require("../../services/todoService");

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let todos = await todoService.findAll({user_id: req.user._id});
        return res.status(200).json({data: todos});
    } catch(err) {
        return res.status(500).json({status: 'error', message: "", error: err});
    }
});

router.post('/create', async(req, res) => {
    try {
        let todoDetails = req.body;
        await todoService.create({title: todoDetails.title, user_id: req.user._id})

        return res.status(200).json({"message": "Todo created successfully."});
    } catch(err) {
        return res.status(500).json({status: 'error', message: err.message, error: err});
    }
});

router.get('/:id', async (req, res) => {
    try {
        let todo = await todoService.findOne({_id: req.params.id});
        return res.status(200).json({data: todo});
    } catch(err) {
        return res.status(500).json({status: 'error', message: "", error: err});
    }
});

router.put('/:id', async (req, res) => {
    try {
        let updatedData = req.body;
        await todoService.update({_id: req.params.id}, updatedData);

        return res.status(200).json({message: "Todo updated Successfully"});
    } catch(err) {
        return res.status(500).json({status: 'error', message: "", error: err});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await todoService.deleteOne({_id: req.params.id});
        return res.json({message: "Todo deleted Successfully"});
    } catch(err) {
        return res.status(500).json({status: 'error', message: "", error: err});
    }
});

module.exports = router;