import React, { useState } from 'react';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'];

export default function ExpenseForm({ onExpenseAdded }) {
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [note, setNote] = useState('');

  // Field errors validation state
  const [errors, setErrors] = useState({});
  // Form submission feedback
  const [submitError, setSubmitError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    // Amount validation
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (Number(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    // Category validation
    if (!category) {
      newErrors.category = 'Category is required';
    }

    // Date validation
    if (!date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      // Set to 23:59:59.999 to prevent timezone offset issues for today's date
      today.setHours(23, 59, 59, 999);

      if (selectedDate > today) {
        newErrors.date = 'Expense date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSuccessMsg('');

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(amount),
          category,
          date,
          note: note.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Mongoose validation or general backend failures
        throw new Error(data.message || 'Failed to add expense');
      }

      setSuccessMsg('Expense added successfully!');

      // Reset values
      setAmount('');
      setCategory('');
      setDate(getTodayString());
      setNote('');
      setErrors({});

      // Callback to alert parent component (e.g. to reload list)
      if (onExpenseAdded) {
        onExpenseAdded(data);
      }

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
    } catch (err) {
      setSubmitError(err.message || 'Server error, failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        Add Expense
      </h2>

      {submitError && (
        <div className="alert alert-danger">
          <span>{submitError}</span>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success">
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="amount">Amount (₹)</label>
          <input
            type="number"
            id="amount"
            className="form-control"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            required
          />
          {errors.amount && <div className="error-msg">{errors.amount}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <div className="error-msg">{errors.category}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          {errors.date && <div className="error-msg">{errors.date}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="note">Note (Optional)</label>
          <textarea
            id="note"
            className="form-control"
            placeholder="Add details (e.g., store, item description)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="3"
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
}
