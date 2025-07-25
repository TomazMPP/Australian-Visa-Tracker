const analyticsModel = require('../models/analyticsModel');

const analyticsController = {
    getKPIs: async (req, res) => {
        try {
            const kpis = await analyticsModel.getKPIs();
            res.status(200).json(kpis);
        } catch (error) {
            console.error('Error getting KPIs:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getTrends: async (req, res) => {
        try {
            const trends = await analyticsModel.getTrends();
            res.status(200).json(trends);
        } catch (error) {
            console.error('Error getting trends:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getComparison: async (req, res) => {
        try {
            const comparison = await analyticsModel.getComparison();
            res.status(200).json(comparison);
        } catch (error) {
            console.error('Error getting comparison:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getDistribution: async (req, res) => {
        try {
            const distribution = await analyticsModel.getDistribution();
            res.status(200).json(distribution);
        } catch (error) {
            console.error('Error getting distribution:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

module.exports = analyticsController; 