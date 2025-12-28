const express = require('express');
const {
  createCursMasok,
  getAllCursMasoks,
  getCursMasokById,
  updateCursMasok,
  deleteCursMasok
} = require('../controllers/CursMasok');

const router = express.Router();

router.post('/', createCursMasok);
router.get('/', getAllCursMasoks);
router.get('/:id', getCursMasokById);
router.put('/:id', updateCursMasok);
router.delete('/:id', deleteCursMasok);

module.exports = router;
