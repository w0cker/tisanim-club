const express = require('express');
const {
  createContent,
  getAllContents,
  getContentById,
  getContentsByCategory,
  updateContent,
  deleteContent
} = require('../controllers/Content');

const router = express.Router();

router.post('/', createContent);
router.get('/', getAllContents);
router.get('/category/:category', getContentsByCategory);
router.get('/:id', getContentById);
router.put('/:id', updateContent);
router.delete('/:id', deleteContent);

module.exports = router;