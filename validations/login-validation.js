const { body, validationResult } = require('express-validator');

exports.index = [
    body('email', 'Email is required').trim().notEmpty().bail().isEmail().withMessage('Email is not valid.'),
    body('password', 'Password field is required and should be 8 characters long').trim().notEmpty().bail().isLength({min:8}),
];