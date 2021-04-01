/**
 * get the user dahsboard
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.index = (req, res, next) => {
    res.render('user/dashboard/index', {
        title: 'Dashboard'
    });
}