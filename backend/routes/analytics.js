const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Analytics endpoints
router.get('/analytics/kpis', analyticsController.getKPIs);
router.get('/analytics/trends', analyticsController.getTrends);
router.get('/analytics/comparison', analyticsController.getComparison);
router.get('/analytics/distribution', analyticsController.getDistribution);

module.exports = router; 