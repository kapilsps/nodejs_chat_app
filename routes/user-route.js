const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/user/dashboard-controller');
const authenicatedMiddleware  = require('../middleware/authenticated-middleware');

router.use(authenicatedMiddleware.index);

/* GET users listing. */
router.get('/dashboard', dashboardController.index);

module.exports = router;
