const { validationResult } = require('express-validator');
const bcrypt                    = require('bcryptjs');
const path                      = require('path');
const { User }                  = require(path.join(__dirname, '..', '..', 'models'));


/**
 * get the register form
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
 exports.index = (req, res, next) => {
    res.render('auth/register',{
        title:'Login',
        layout:'layouts/auth-layout'
    });
}



/**
 * handle post request for register
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
 exports.register = (req, res, next) => {
    const errors = validationResult(req).array();
    let usrErrVal, usrErrMsg, emailErrMsg, emailErrVal, pwdErrMsg, pwdErrVal, cnfPwdErrMsg, cnfPwdErrVal;
    if (errors.length > 0) {
        errors.find((el) => {

            if(el.param === 'username'){
                usrErrMsg = el.msg;
                usrErrVal = el.value;
            }

            if(el.param === 'email'){
                emailErrMsg = el.msg;
                emailErrVal = el.value;
            }

            if(el.param === 'password'){
                pwdErrMsg = el.msg;
                pwdErrVal = el.value;
            }

            if(el.param === 'confirm_password'){
                cnfPwdErrMsg = el.msg;
                cnfPwdErrVal = el.value;
            }
        });

        return res.status(422).render('auth/register',{
                                            title: 'Register', 
                                            layout: 'layouts/auth-layout',
                                            usrErrMsg:usrErrMsg,
                                            usrErrVal: (usrErrVal) ? usrErrVal : req.body.username,
                                            emailErrMsg:emailErrMsg,
                                            emailErrVal: (emailErrVal) ? emailErrVal : req.body.email,
                                            pwdErrMsg:pwdErrMsg,
                                            pwdErrVal:pwdErrVal,
                                            cnfPwdErrMsg:cnfPwdErrMsg,
                                            cnfPwdErrVal:cnfPwdErrVal
                                    });
    }else{
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                User.create({
                        name:req.body.username,
                        email:req.body.email,
                        password:hash
                    })
                    .then(result => {
                        if(result !== null){
                            req.flash('success', 'Registered successfully.')
                            return res.redirect('/login');
                        }
                        req.flash('fail', 'Something went wrong please try again')
                        return res.redirect('/register');
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
        });
    }
};