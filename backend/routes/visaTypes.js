const express = require('express')
const router = express.Router();
const visaTypeController = require('../controllers/visaTypeController');

router.get('/visas', visaTypeController.getAllVisas);
router.get('/visas/:id', visaTypeController.getSpecificVisa);

module.exports = router;