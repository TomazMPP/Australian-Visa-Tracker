const categoryModel = require('../models/categoryModel');

const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await categoryModel.getAllCategories()
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error'});
    }
  },

  getVisasByCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const categories = await categoryModel.getVisasByCategory(id);
      
      if (!categories) {
        return res.status(404).json({ message: 'Category Not Found'});
      }

      res.status(200).json(categories)
    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  }
}

module.exports = categoryController;