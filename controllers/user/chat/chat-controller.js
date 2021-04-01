const { v4: uuidv4 } = require('uuid');

/**
 * get the user dahsboard
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
 exports.index = (req, res, next) => {
    res.render('user/chat-room/index',{
        roomId: uuidv4(),
        userId: 5,
        layout:'layouts/chat-layout'
    });
}