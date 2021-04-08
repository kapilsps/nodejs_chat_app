const express = require('express');
const router = express.Router();
const chatController = require('../controllers/user/chat/chat-controller');



/* GET home page. */
router.get('/create/chat-room', chatController.index);

router.get('/chat-room/:roomId', chatController.room);

module.exports = router;
