const express = require('express');
const router = express.Router();
const loginController = require('../controllers/auth/login-controller');
const registerController = require('../controllers/auth/register-controller');
const forgotPasswordController = require('../controllers/auth/forgot-password-controller');
const loginValidations = require('../validations/login-validation');
const registerValidations = require('../validations/register-validation');
const redirectIfAuthenticatedMiddleware = require('../middleware/redirect-if-authenticated');
const forgotValidations = require('../validations/forgot-password-validation');
const resetPasswordController = require('../controllers/auth/reset-password-controller');
const resetPasswordValidation = require('../validations/reset-password-validation');

router.get('/login', redirectIfAuthenticatedMiddleware.index, loginController.index);

router.post('/login', loginValidations.index, loginController.login);

router.get('/logout', loginController.logout);

router.get('/register', redirectIfAuthenticatedMiddleware.index,  registerController.index);

router.post('/register', registerValidations.index, registerController.register);

router.get('/forgot-password', redirectIfAuthenticatedMiddleware.index, forgotPasswordController.index);

router.post('/forgot-password', forgotValidations.index, forgotPasswordController.sendLink);

router.get('/reset/:token', redirectIfAuthenticatedMiddleware.index, resetPasswordController.index);

router.post('/change-password', resetPasswordValidation.index, resetPasswordController.store);

module.exports = router;