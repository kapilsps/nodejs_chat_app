const { body, validationResult }    = require('express-validator');
const { Op }                        = require("sequelize");
const { User }                          = require('../models');

exports.index = [
    body('email', 'Email is required.').trim().notEmpty().bail().isEmail().withMessage('Email is not valid.').bail().custom((value) => {
        return User.findOne({
                        attributes: ['email'],
                        where:{
                            email:{
                                [Op.eq]:value
                            }
                        }
                    })
                    .then(user => {
                        if (user !== null) {
                            return Promise.reject('E-mail already in use');
                        }
                        return true;
                    });
    }),
    body('username', 'Username is required and length of 2 character.').trim().notEmpty().bail().isLength({min:2}),
    body('password', 'Password is required and should be 8 characters long').trim().notEmpty().bail().isLength({min:8}),
    body('confirm_password', 'Confirm Password is required and should match the password field').trim().notEmpty().bail().isLength({min:8}).bail().custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
];