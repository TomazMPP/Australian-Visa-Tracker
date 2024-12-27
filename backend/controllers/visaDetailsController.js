const visaDetailsModel = require('../models/visaDetailsModel');

const visaDetailsController = {
    getVisaDetails: async (req, res) => {
        try {
            const { id } = req.params;
            const { stream_id } = req.query;
            const details = await visaDetailsModel.getVisaDetails(id, stream_id || null);
            
            if (!details) {
                return res.status(404).json({ message: 'Visa not found' });
            }

            res.status(200).json(details);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getVisaHistory: async (req, res) => {
      try {
          const { id } = req.params;
          const { stream_id } = req.query; 
          const history = await visaDetailsModel.getVisaHistory(id, stream_id || null);
          
          if (!history || history.length === 0) {
              return res.status(404).json({ message: 'No history found for this visa' });
          }
  
          res.status(200).json(history);
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
      }
  }
};

module.exports = visaDetailsController;