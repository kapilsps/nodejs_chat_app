const { validationResult } = require('express-validator');
const { PasswordReset, User } = require('../../models');
const { Op }    = require("sequelize");
const bcrypt = require('bcryptjs');


/**
 * get the reset password view
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.index = (req, res, next) => {
    res.render('auth/reset-password',{
        layout: 'layouts/auth-layout',
        token: req.params.token,
        email: req.query.email,
        title:'Reset Password'
    });
}

/**
 * reset the user password
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.store = (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        req.flash('fail', errors[0].msg);
        return res.redirect('back');
    }else{
        const email = req.body.email;
        const password = req.body.password;

        PasswordReset.findOne({
            where:{
                email:{
                    [Op.eq]:email
                },
                expireAt:{
                    [Op.gte]: Date.now()
                }
            }
        }).then(result => {

            if(result !== null){
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(password, salt, function(err, hash) {
                        User.findOne({
                            where:{
                                email:{
                                    [Op.eq]:email
                                }
                            }
                        }).then(user => {
                            user.update({
                                password: hash
                            }).then(response => {
                                req.flash('success', 'Password reset successfully.');
                                            return res.redirect('/login');
                            });
                        });
                    });
                });
            }else{
                req.flash('fail', 'Password reset token is invalid or has expired.');
                return res.redirect('back');
            }

        })
        .catch(err => {
            console.log(err);
        });
    }
}