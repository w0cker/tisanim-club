const Content = require('../models/Content');

const createContent = async (req, res) => {
  try {
    const content = await Content.create(req.body);
    res.status(201).json(content);
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ 
      message: 'Error creating content',
      error: error.message 
    });
  }
};

const getAllContents = async (req, res) => {
  try {
    const contents = await Content.find({});
    res.status(200).json({ 
      count: contents.length, 
      data: contents 
    });
  } catch (error) {
    console.error('Error fetching contents:', error);
    res.status(500).json({ 
      message: 'Error fetching contents',
      error: error.message 
    });
  }
};

const getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.status(200).json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ 
      message: 'Error fetching content',
      error: error.message 
    });
  }
};

const getContentsByCategory = async (req, res) => {
  try {
    const contents = await Content.find({ category: req.params.category });
    res.status(200).json({ 
      count: contents.length, 
      data: contents 
    });
  } catch (error) {
    console.error('Error fetching contents by category:', error);
    res.status(500).json({ 
      message: 'Error fetching contents by category',
      error: error.message 
    });
  }
};

const updateContent = async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.status(200).json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ 
      message: 'Error updating content',
      error: error.message 
    });
  }
};

const deleteContent = async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.status(200).json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ 
      message: 'Error deleting content',
      error: error.message 
    });
  }
};

module.exports = {
  createContent,
  getAllContents,
  getContentById,
  getContentsByCategory,
  updateContent,
  deleteContent
};