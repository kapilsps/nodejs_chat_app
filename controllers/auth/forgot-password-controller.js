/**
 * get the forgot password form
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
 exports.index = (req, res, next) => {
    res.render('auth/forgot-password',{
        title:'Login',
        layout:'layouts/auth-layout'
    });
}