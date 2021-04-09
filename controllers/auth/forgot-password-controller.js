const crypto = require('crypto');
const { validationResult } = require('express-validator');
const { PasswordReset } = require('../../models');
const { Op }    = require("sequelize");
const EmailController = require('../common/email/email-controller');
const moment = require('moment');



/**
 * get the forgot password form
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
 exports.index = (req, res, next) => {
    res.render('auth/forgot-password',{
        title:'Forgot Password',
        layout:'layouts/auth-layout'
    });
}



exports.sendLink = (req, res, next) => {
    const errors = validationResult(req).array();
    let emailErrMsg, emailErrVal;
    if (errors.length > 0) {
        errors.find((el) => {
            if(el.param === 'email'){
                emailErrMsg = el.msg;
                emailErrVal = el.value;
            }
        });

        return res.status(422).render('auth/forgot-password',{
                                        title: 'Forgot Password', 
                                        layout: 'layouts/auth-layout',
                                        emailErrMsg:emailErrMsg,
                                        emailErrVal: (emailErrVal) ? emailErrVal : req.body.email,
                                    });
    }else{
        crypto.randomBytes(20, (err, buf) => {
            const token = buf.toString('hex');
            const email = req.body.email;
            PasswordReset.findOne({
                                attributes: ['email'],
                                where:{
                                    email:{
                                        [Op.eq]:email
                                    }
                                }
                            })
                            .then(result => {
                                if (result == null) {
                                    PasswordReset.create({
                                        email,
                                        token,
                                        expireAt: (Date.now() + 3600000)
                                    }).then(response => {
                                        EmailController.resetPasswordMail({email, token});
                                        if(response !== null){
                                            req.flash('success', 'Reset password link send successfully')
                                            return res.redirect('/forgot-password');
                                        }
                                        req.flash('fail', 'Something went wrong please try again')
                                        return res.redirect('/forgot-password');
                                    });
                                }else{
                                    result.update({
                                        token,
                                        expireAt: (Date.now() + 3600000)
                                    }).then(response => {
                                        EmailController.resetPasswordMail({email, token});
                                        if(response !== null){
                                            req.flash('success', 'Reset password link send successfully')
                                            return res.redirect('/forgot-password');
                                        }
                                        req.flash('fail', 'Something went wrong please try again')
                                        return res.redirect('/forgot-password');
                                    })
                                }
                            }).catch(err => {
                                console.log(err);
                            });
        });
    }
}