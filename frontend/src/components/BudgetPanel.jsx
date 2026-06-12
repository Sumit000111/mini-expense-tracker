import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'];

export default function BudgetPanel({ budgets = [], categorySpent = {}, onBudgetUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLimits, setEditLimits] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Map database budgets array to a helper object: { Category: Limit }
  const budgetLimits = CATEGORIES.reduce((acc, cat) => {
    const found = budgets.find(b => b.category.toLowerCase() === cat.toLowerCase());
    acc[cat] = found ? found.limit : 0;
    return acc;
  }, {});

  // Initialize edit fields with current limits when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setEditLimits({ ...budgetLimits });
      setError('');
    }
  }, [isEditing, budgets]);

  const handleLimitChange = (cat, val) => {
    const numVal = val === '' ? '' : Number(val);
    setEditLimits(prev => ({
      ...prev,
      [cat]: numVal
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Loop over categories and update each changed limit
      for (const cat of CATEGORIES) {
        const newLimit = editLimits[cat] === '' ? 0 : Number(editLimits[cat]);
        const oldLimit = budgetLimits[cat];

        if (newLimit !== oldLimit) {
          if (newLimit < 0) {
            throw new Error('Budget limits cannot be negative');
          }

          const response = await fetch('/api/budgets', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              category: cat,
              limit: newLimit
            })
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || `Failed to save budget for ${cat}`);
          }
        }
      }

      setIsEditing(false);
      if (onBudgetUpdated) {
        await onBudgetUpdated();
      }
    } catch (err) {
      setError(err.message || 'Error saving budget limits');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="card">
      <div className="budget-header">
        <h2>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          Category Budgets
        </h2>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className="budget-btn-toggle"
          disabled={saving}
        >
          {isEditing ? 'Cancel' : 'Edit Budgets'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ padding: '0.5rem 0.75rem', marginBottom: '1rem' }}>
          <span>{error}</span>
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSave} className="budget-edit-list">
          {CATEGORIES.map(cat => (
            <div className="budget-edit-row" key={cat}>
              <label htmlFor={`limit-${cat}`}>{cat}</label>
              <input
                id={`limit-${cat}`}
                type="number"
                min="0"
                step="100"
                className="form-control"
                placeholder="No limit"
                value={editLimits[cat] ?? ''}
                onChange={(e) => handleLimitChange(cat, e.target.value)}
                disabled={saving}
              />
            </div>
          ))}
          <div className="budget-edit-actions">
            <button type="submit" className="btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setIsEditing(false)}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="budget-progress-container">
          {CATEGORIES.map(cat => {
            const spent = categorySpent[cat] || 0;
            const limit = budgetLimits[cat] || 0;
            const hasLimit = limit > 0;
            const isOver = hasLimit && spent > limit;
            const diff = Math.abs(limit - spent);

            // Compute fill percentage (max 100)
            const percentage = hasLimit ? Math.min((spent / limit) * 100, 100) : 0;

            return (
              <div className="budget-item" key={cat}>
                <div className="budget-info">
                  <span className="budget-category">
                    {cat}
                  </span>
                  <span className={`budget-usage ${isOver ? 'over' : 'normal'}`}>
                    {formatCurrency(spent)} / {hasLimit ? formatCurrency(limit) : 'No Budget'}
                  </span>
                </div>
                
                <div className="budget-bar-bg">
                  <div 
                    className={`budget-bar-fill ${isOver ? 'over' : 'normal'}`} 
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="budget-footer">
                  {hasLimit ? (
                    isOver ? (
                      <span className="budget-badge over">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        Over budget by {formatCurrency(diff)}
                      </span>
                    ) : (
                      <span className="budget-badge remaining">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {formatCurrency(diff)} remaining
                      </span>
                    )
                  ) : (
                    <span className="budget-badge none">
                      No budget set
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
