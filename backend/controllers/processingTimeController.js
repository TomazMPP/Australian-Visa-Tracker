const processingTime = require('../models/processingTime');

const processingTimeController = {
  getAllTimes: async (req, res) => {
    try {
      const times = await processingTime.getAllTimes()
      res.status(200).json(times);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error'});
    }
  },

  getTimesByVisaType : async (req, res) => {
    try {
      const { visa_type_id } = req.params;
      const visaTimes = await processingTime.getTimesByVisaType(visa_type_id)
      
      if (!visaTimes) {
        return res.status(404).json({ message: 'Visa Not Found'});
      }

      res.status(200).json(visaTimes)
    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  },

  getHistoryByVisaType  : async (req, res) => {
    try {
      const { visa_type_id } = req.params;
      const historyTimes = await processingTime.getHistoryByVisaType(visa_type_id)
      
      if (!historyTimes) {
        return res.status(404).json({ message: 'Visa Not Found'});
      }

      res.status(200).json(historyTimes)
    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  },

  postNewProcessingTime  : async (req, res) => {
    try {
      const { visa_type_id, percent_50, percent_90 } = req.body;
      
      const newTime = await processingTime.postNewProcessingTime(visa_type_id, percent_50, percent_90);

      res.status(201).json(newTime)
      
    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  },

}

module.exports = processingTimeController;