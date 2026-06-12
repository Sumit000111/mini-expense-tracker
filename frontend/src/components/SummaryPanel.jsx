import React from 'react';

export default function SummaryPanel({ summaryData }) {
  if (!summaryData) {
    return (
      <div className="summary-grid">
        <div className="summary-card"><p>Loading summary...</p></div>
        <div className="summary-card"><p>Loading summary...</p></div>
        <div className="summary-card"><p>Loading summary...</p></div>
      </div>
    );
  }

  const { totalThisMonth = 0, categoryBreakdown = {}, highestExpense = null } = summaryData;

  // Convert category breakdown object into an array sorted by amount descending
  const categoriesArray = Object.entries(categoryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3); // Only show top 3 categories in the quick summary to keep it clean

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.substring(0, 10);
  };

  return (
    <div className="summary-grid animate-fade">
      {/* Total spent this month */}
      <div className="summary-card">
        <h3>This Month</h3>
        <div className="summary-val" style={{ color: 'var(--success)' }}>
          {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
          }).format(totalThisMonth)}
        </div>
        <p>Total spent in current month</p>
      </div>

      {/* Highest Single Expense */}
      <div className="summary-card">
        <h3>Highest Expense</h3>
        {highestExpense ? (
          <>
            <div className="summary-val" style={{ color: 'var(--error)' }}>
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(highestExpense.amount)}
            </div>
            <p>
              In <span className="summary-subtext">{highestExpense.category}</span> on {formatDate(highestExpense.date)}
            </p>
          </>
        ) : (
          <>
            <div className="summary-val" style={{ color: 'var(--text-muted)' }}>—</div>
            <p>No expenses recorded yet</p>
          </>
        )}
      </div>

      {/* Top Categories Breakdown */}
      <div className="summary-card">
        <h3>Top Categories</h3>
        {categoriesArray.length > 0 ? (
          <div className="category-summary-list" style={{ marginTop: '0.5rem' }}>
            {categoriesArray.map(([cat, amount], idx) => (
              <div className="category-summary-row" key={cat}>
                <span className="category-summary-label">
                  <span 
                    className="category-summary-dot" 
                    style={{ 
                      backgroundColor: idx === 0 ? 'var(--primary)' : idx === 1 ? '#a855f7' : '#06b6d4' 
                    }}
                  />
                  {cat}
                </span>
                <span className="category-summary-value">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                  }).format(amount)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="summary-val" style={{ color: 'var(--text-muted)', fontSize: '1.5rem', margin: '0.8rem 0' }}>None</div>
            <p>No category breakdown</p>
          </>
        )}
      </div>
    </div>
  );
}
