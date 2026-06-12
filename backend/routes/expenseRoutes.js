const express = require('express');
const router = express.Router();
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary
} = require('../controllers/expenseController');

// Define routes mapped to our controllers
router.route('/')
  .get(getExpenses)
  .post(createExpense);

// Summary route must be defined BEFORE /:id route
router.route('/summary')
  .get(getExpenseSummary);

router.route('/:id')
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;
