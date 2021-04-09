const { v4: uuidV4 } = require('uuid');

/**
* get the user dahsboard
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
exports.index = (req, res, next) => {
    res.redirect(`/users/chat-room/${uuidV4()}`);
}


/**
 * Create the room for the user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.room = (req, res, next) => {
    res.render('user/chat-room/index',{
        roomId: req.params.roomId,
        userName: req.user.name,
        layout:'layouts/chat-layout'
    });
}