const express = require('express');
const router = express.Router();
const chatController = require('../controllers/user/chat/chat-controller');



/* GET home page. */
router.get('/chat-room', chatController.index);

module.exports = router;
