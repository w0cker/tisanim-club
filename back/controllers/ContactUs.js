const ContactUs = require('../models/ContactUs');

// Create contactUs
const createContactUs = async (req, res) => {
  try {
    const { name, email, Info_req,Info_res, createdAt } = req.body;
    if (!name || !email || !Info_req) {
      return res.status(400).send({
        message: 'Send required fields: name, email, password , reatedAt',
      });
    }

    const contactUs = await ContactUs.create({  name, email, Info_req,Info_res, createdAt });
    res.status(201).send(contactUs);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Get all contactUss
const getAllContactUs = async (req, res) => {
  try {
    const contactUss = await ContactUs.find({});
    res.status(200).json({ count: contactUss.length, data: contactUss });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  } 
};

// Get contactUs by ID
const getContactUsById = async (req, res) => {
  try {
    const contactUs = await ContactUs.findById(req.params.id);
    res.status(200).json(contactUs);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Update ContactUs
const updateContactUs = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({
        message: 'Send all required fields: title, author, publishYear',
      });
    }

    const result = await ContactUs.findByIdAndUpdate(req.params.id, req.body);
    if (!result) {
      return res.status(404).json({ message: 'contactUs not found' });
    }

    res.status(200).send({ message: 'ContactUs updated successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Delete ContactUs
const deleteContactUs = async (req, res) => {
  try {
    const result = await ContactUs.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'contactUs not found' });
    }
    res.status(200).send({ message: 'contactUs deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  createContactUs,
  getAllContactUs,
  getContactUsById,
  updateContactUs,
  deleteContactUs
};
