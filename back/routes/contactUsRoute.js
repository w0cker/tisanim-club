const express = require('express');
const {
  createContactUs,
  getAllContactUs,
  getContactUsById,
  updateContactUs,
  deleteContactUs
} = require('../controllers/ContactUs');

const router = express.Router();

router.post('/', createContactUs);
router.get('/', getAllContactUs);
router.get('/:id', getContactUsById);
router.put('/:id', updateContactUs);
router.delete('/:id', deleteContactUs);

module.exports = router;
