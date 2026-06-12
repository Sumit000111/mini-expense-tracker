const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// @desc    Get all budgets and current month's spent amount per category
// @route   GET /api/budgets
// @access  Public
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find();
    
    // Calculate current month's spent per category
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const monthlyExpenses = await Expense.find({
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const categorySpent = {};
    monthlyExpenses.forEach(exp => {
      categorySpent[exp.category] = (categorySpent[exp.category] || 0) + exp.amount;
    });

    res.status(200).json({
      budgets,
      categorySpent
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upsert budget for a category
// @route   PUT /api/budgets
// @access  Public
const updateBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    if (limit === undefined || limit < 0) {
      return res.status(400).json({ message: 'Limit must be a positive number' });
    }

    const budget = await Budget.findOneAndUpdate(
      { category },
      { limit },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getBudgets,
  updateBudget
};
