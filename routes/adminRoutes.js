const express = require('express');
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middlewares/adminVerify')
const router = express.Router();

router.get('/',adminMiddleware.isAdmin, adminController.getAdmin );

router.get('/report/:reportId',adminMiddleware.isAdmin,adminController.getReport );

router.get('/deletereport/:reportId',adminMiddleware.isAdmin, adminController.deleteReport)

router.post('/delete/:deleteId',adminMiddleware.isAdmin, adminController.deleteAccount)

module.exports = router;