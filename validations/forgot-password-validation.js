const { body, validationResult }    = require('express-validator');
const { Op }    = require("sequelize");
const { User }  = require('../models');

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
            if (user == null) {
                return Promise.reject('Email does not exist.');
            }
            return true;
        });
    })
];