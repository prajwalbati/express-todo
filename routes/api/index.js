var express = require('express');
var router = express.Router();
var passport = require('passport');

let todoService = require("../../services/todoService");
let authController = require("../../controllers/api/authController");
let { createUserValidation } = require("../../validators/userValidator");

router.get('/test', (req, res, next) => {
    return res.json({data: "This is custom data", message: "This is message"});
});

router.get('/test-loggedin', [passport.authenticate('bearer', {session: false})], (req, res) => {
    try {
        return res.json({message: "You are logged in. Welcome"});
    } catch(err) {
        return res.status(500).json({status: 'error', message: "", error: err});
    }
});

router.get('/todos', [passport.authenticate('bearer', {session: false})], async (req, res) => {
    try {
        let todos = await todoService.findAll({user_id: req.user._id});
        return res.json({data: todos});
    } catch(err) {
        return res.status(500).json({status: 'error', message: "", error: err});
    }
});

router.post('/register', [createUserValidation], authController.registerUser);
router.get('/:token/activate', authController.activateUser);

router.post('/login', authController.loginUser);

module.exports = router;