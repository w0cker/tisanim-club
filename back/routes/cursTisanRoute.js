const express = require('express');
const {
  createCursTisan,
  getAllCursTisans,
  getCursTisanById,
  updateCursTisan,
  deleteCursTisan
} = require('../controllers/CursTisan');

const router = express.Router();

router.post('/', createCursTisan);
router.get('/', getAllCursTisans);
router.get('/:id', getCursTisanById);
router.put('/:id', updateCursTisan);
router.delete('/:id', deleteCursTisan);

module.exports = router;
