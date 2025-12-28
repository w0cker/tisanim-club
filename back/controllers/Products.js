const Product = require('../models/Products');

// Create Product
const createProduct = async (req, res) => {
  try {
    const { name, specification, category , cost , onStock, countItems , createdAt } = req.body;
    if (!name || !specification || !cost) {
      return res.status(400).send({
        message: 'Send required fields: name, specification,category , cost , onStock, countItems ',
      });
    }

    const product = await Product.create({ name, specification,category , cost , onStock, countItems , createdAt});
    res.status(201).send(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Get all users
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ count: products.length, data: products });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  } 
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const {name, specification,category , cost , onStock, countItems , createdAt} = req.body;
    if (!name || !specification || !cost) {
      return res.status(400).send({
        message: 'Send all required fields: name, specification,category , cost , onStock, countItems , createdAt',
      });
    }

    const result = await Product.findByIdAndUpdate(req.params.id, req.body);
    if (!result) {
      return res.status(404).json({ message: 'product not found' });
    }

    res.status(200).send({ message: 'Product updated successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'product not found' });
    }
    res.status(200).send({ message: 'product deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
