const express = require('express');
const {
  createCursDron,
  getAllCursDrons,
  getCursDronById,
  updateCursDron,
  deleteCursDron
} = require('../controllers/CursDron');

const router = express.Router();

router.post('/', createCursDron);
router.get('/', getAllCursDrons);
router.get('/:id', getCursDronById);
router.put('/:id', updateCursDron);
router.delete('/:id', deleteCursDron);

module.exports = router;
