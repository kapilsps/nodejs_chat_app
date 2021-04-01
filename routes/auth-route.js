const express = require('express');
const router = express.Router();
const loginController = require('../controllers/auth/login-controller');
const registerController = require('../controllers/auth/register-controller');
const forgotPasswordController = require('../controllers/auth/forgot-password-controller');
const loginValidations = require('../validations/login-validation');
const registerValidations = require('../validations/register-validation');
const redirectIfAuthenticatedMiddleware = require('../middleware/redirect-if-authenticated');

router.get('/login', redirectIfAuthenticatedMiddleware.index, loginController.index);

router.post('/login', loginValidations.index, loginController.login);

router.get('/logout', loginController.logout);

router.get('/register', redirectIfAuthenticatedMiddleware.index,  registerController.index);

router.post('/register', registerValidations.index, registerController.register);

router.get('/forgot-password', redirectIfAuthenticatedMiddleware.index, forgotPasswordController.index);

module.exports = router;