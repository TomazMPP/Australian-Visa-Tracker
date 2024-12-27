const express = require('express')
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

router.get('/statistics/category/:id', statisticsController.getStatisticsByCategory);
module.exports = router;