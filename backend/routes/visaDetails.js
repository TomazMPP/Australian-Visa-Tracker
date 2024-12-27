const express = require('express')
const router = express.Router();
const visaDetailsController = require('../controllers/visaDetailsController');

router.get('/visa/:id', visaDetailsController.getVisaDetails);
router.get('/visa/:id/history', visaDetailsController.getVisaHistory);

module.exports = router;