const express = require('express');
const router = express.Router();
const { getBudgets, updateBudget } = require('../controllers/budgetController');

router.route('/')
  .get(getBudgets)
  .put(updateBudget);

module.exports = router;
