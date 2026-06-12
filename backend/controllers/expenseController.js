const Expense = require('../models/Expense');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Public
const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    const query = {};

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Filter by date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Parse end date and set to end of that day (23:59:59.999)
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const expenses = await Expense.find(query).sort({ date: -1 }); // Sort by date newest first
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Public
const createExpense = async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;

    // Create a new expense document
    const expense = await Expense.create({
      amount,
      category,
      date,
      note
    });

    res.status(201).json(expense);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Public
const updateExpense = async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;

    // Find and update the expense
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    expense.amount = amount !== undefined ? amount : expense.amount;
    expense.category = category !== undefined ? category : expense.category;
    expense.date = date !== undefined ? date : expense.date;
    expense.note = note !== undefined ? note : expense.note;

    // Save triggers model validations
    const updatedExpense = await expense.save();
    res.status(200).json(updatedExpense);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Public
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await expense.deleteOne();
    res.status(200).json({ message: 'Expense removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get expense summary (total this month, breakdown per category, highest single)
// @route   GET /api/expenses/summary
// @access  Public
const getExpenseSummary = async (req, res) => {
  try {
    const now = new Date();
    // Start of the current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // End of the current month
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999); // js trick to get last day

    // 1. Total spent this month
    const monthlyExpenses = await Expense.find({
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });
    const totalThisMonth = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0); // added accumulator sum

    // 2. Breakdown per category (all-time)
    const allExpenses = await Expense.find();
    const categoryBreakdown = {};
    allExpenses.forEach(exp => {
      categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + exp.amount;
    });

    // 3. Highest single expense (all-time)
    const highestExpense = await Expense.findOne().sort({ amount: -1 });

    res.status(200).json({
      totalThisMonth,
      categoryBreakdown,
      highestExpense: highestExpense
        ? {
            id: highestExpense._id,
            amount: highestExpense.amount,
            category: highestExpense.category,
            date: highestExpense.date,
            note: highestExpense.note
          }
        : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary
};
