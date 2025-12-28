const CursDron = require('../models/CursDron');

// Create User
const createCursDron = async (req, res) => {
  try {
    const { name, email, Age , createdAt , CursProgres } = req.body;
    if (!name || !email || !Age) {
      return res.status(400).send({
        message: 'Send required fields: name, email, Age , createdAt , CursProgres ',
      });
    }

    const user = await CursDron.create({ name, email, Age , createdAt , CursProgres });
    res.status(201).send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Get all users
const getAllCursDrons = async (req, res) => {
  try {
    const users = await CursDron.find({});
    res.status(200).json({ count: users.length, data: users });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  } 
};

// Get user by ID
const getCursDronById = async (req, res) => {
  try {
    const user = await CursDron.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Update user
const updateCursDron = async (req, res) => {
  try {
    const { name, email, Age , createdAt , CursProgres } = req.body;
    if (!name || !email || !Age) {
      return res.status(400).send({
        message: 'Send all required fields: name, email, Age , createdAt , CursProgres ',
      });
    }

    const result = await CursDron.findByIdAndUpdate(req.params.id, req.body);
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).send({ message: 'User updated successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Delete User
const deleteCursDron = async (req, res) => {
  try {
    const result = await CursDron.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'user not found' });
    }
    res.status(200).send({ message: 'user deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  createCursDron,
  getAllCursDrons,
  getCursDronById,
  updateCursDron,
  deleteCursDron
};
