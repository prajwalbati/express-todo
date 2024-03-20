const express = require('express');

let authController = require("../../controllers/api/authController");
let { createUserValidation, resendActivationTokenValidation } = require("../../validators/userValidator");

const router = express.Router();

router.post('/register', [createUserValidation], authController.registerUser);
router.post('/:token/activate', authController.activateUser);
router.post('/resend-activation', resendActivationTokenValidation, authController.resendActivationToken);
router.post('/login', authController.loginUser);

module.exports = router;