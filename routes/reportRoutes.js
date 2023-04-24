const express = require('express');
const reportController = require('../controllers/reportController');
const router = express.Router();


router.get('/:reportedId',reportController.getReport );
router.post('/:reportedId',reportController.postReport );

module.exports = router;