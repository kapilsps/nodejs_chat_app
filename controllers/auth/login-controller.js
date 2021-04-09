const { validationResult } = require('express-validator');
const passport = require('passport');

/**
 * get the login form
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.index = (req, res, next) => {
    res.render('auth/login',{
        title:'Login',
        layout:'layouts/auth-layout'
    });
}


/**
 *
 * Handle login post request
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 
 */
 exports.login = (req, res, next) => {
    const errors = validationResult(req).array();
    let emailErrMsg, emailErrVal, pwdErrMsg, pwdErrVal = null;
    if (errors.length > 0) {
        errors.find((el) => {
            if(el.param === 'email'){
                emailErrMsg = el.msg;
                emailErrVal = el.value;
            }

            if(el.param === 'password'){
                pwdErrMsg = el.msg;
                pwdErrVal = el.value;
            }
        });

        req.flash('fail', 'Login Failed.');
        return res.status(422).render('auth/login',{
            title:'Login',
            layout:'layouts/auth-layout',
            emailErrMsg:emailErrMsg,
            emailErrVal:(emailErrVal) ? emailErrVal : req.body.email,
            pwdErrMsg:pwdErrMsg,
            pwdErrVal:pwdErrVal
        });
    }else{
        passport.authenticate('local',{
            successRedirect:'/users/dashboard',
            failureRedirect:'/login',
            failureFlash:true
        })(req, res, next);
    }
};


/**
 * handle the logout request
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.logout = (req, res, next) => {
    req.logout();
    req.flash('success', 'Logout successfully.');
    res.redirect('/login');
}