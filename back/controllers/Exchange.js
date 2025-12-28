const Exchange = require('../models/Exchange');

const createExchange = async (req, res) => {
  try {
    const exchange = await Exchange.create(req.body);
    res.status(201).json(exchange);
  } catch (error) {
    console.error('Error creating exchange:', error);
    res.status(500).json({ 
      message: 'Error creating exchange',
      error: error.message 
    });
  }
};

const getAllExchanges = async (req, res) => {
  try {
    const exchanges = await Exchange.find({});
    res.status(200).json({ 
      count: exchanges.length, 
      data: exchanges 
    });
  } catch (error) {
    console.error('Error fetching exchanges:', error);
    res.status(500).json({ 
      message: 'Error fetching exchanges',
      error: error.message 
    });
  }
};

const getExchangeById = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);
    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }
    res.status(200).json(exchange);
  } catch (error) {
    console.error('Error fetching exchange:', error);
    res.status(500).json({ 
      message: 'Error fetching exchange',
      error: error.message 
    });
  }
};

const updateExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }
    res.status(200).json(exchange);
  } catch (error) {
    console.error('Error updating exchange:', error);
    res.status(500).json({ 
      message: 'Error updating exchange',
      error: error.message 
    });
  }
};

const deleteExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findByIdAndDelete(req.params.id);
    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }
    res.status(200).json({ message: 'Exchange deleted successfully' });
  } catch (error) {
    console.error('Error deleting exchange:', error);
    res.status(500).json({ 
      message: 'Error deleting exchange',
      error: error.message 
    });
  }
};

module.exports = {
  createExchange,
  getAllExchanges,
  getExchangeById,
  updateExchange,
  deleteExchange
};