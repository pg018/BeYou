const express = require('express');
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middlewares/adminVerify')
const router = express.Router();

router.get('/',adminMiddleware.isAdmin, adminController.getAdmin );

router.get('/report/:reportedId',adminController.getReport );

module.exports = router;