const express = require('express');
const {
  createExchange,
  getAllExchanges,
  getExchangeById,
  updateExchange,
  deleteExchange
} = require('../controllers/Exchange');

const router = express.Router();

router.post('/', createExchange);
router.get('/', getAllExchanges);
router.get('/:id', getExchangeById);
router.put('/:id', updateExchange);
router.delete('/:id', deleteExchange);

module.exports = router;