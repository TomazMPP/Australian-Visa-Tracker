const express = require('express')
const router = express.Router();
const processingTimeController = require('../controllers/processingTimeController');

router.get('/processing-times', processingTimeController.getAllTimes);
router.get('/processing-times/visa/:visa_type_id', processingTimeController.getTimesByVisaType);
router.get('/processing-times/visa/:visa_type_id/history', processingTimeController.getHistoryByVisaType);
router.get('/processing-times/category/:category_id', processingTimeController.getTimesByCategory);
router.post('/processing-times', processingTimeController.postNewProcessingTime)

module.exports = router;