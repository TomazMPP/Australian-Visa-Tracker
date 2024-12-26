const visaTypeModel = require('../models/visaType');

const visaTypeController = {
  getAllVisas: async (req, res) => {
    try {
      const visas = await visaTypeModel.getAllVisas()
      res.status(200).json(visas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error'});
    }
  },
  getSpecificVisa: async (req, res) => {
    try {
      const { id } = req.params;
      const specificVisa = await visaTypeModel.getSpecificVisa(id);
      
      if (!specificVisa) {
        return res.status(404).json({ message: 'Visa Not Found'});
      }

      res.status(200).json(specificVisa)
    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  }
}

module.exports = visaTypeController;