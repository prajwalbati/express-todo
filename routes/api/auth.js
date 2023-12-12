const express = require('express');

let authController = require("../../controllers/api/authController");
let { createUserValidation } = require("../../validators/userValidator");

const router = express.Router();

router.post('/register', [createUserValidation], authController.registerUser);
router.get('/:token/activate', authController.activateUser);
router.post('/login', authController.loginUser);

module.exports = router;