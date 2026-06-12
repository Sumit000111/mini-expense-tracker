const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
      validate: {
        validator: function(value) {
          return value <= new Date(Date.now() + 60000); // 1 minute ka buffer hai while adding expense
        },
        message: 'Expense date cannot be in the future'
      }
    },
    note: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
