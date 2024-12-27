const statisticsModel = require('../models/statisticsModel');

const statisticsController = {

    getStatisticsByCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const statistics = await statisticsModel.getStatisticsByCategory(id);
            
            if (!statistics) {
                return res.status(404).json({ message: 'No statistics found for this category' });
            }

            res.status(200).json(statistics);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

module.exports = statisticsController;