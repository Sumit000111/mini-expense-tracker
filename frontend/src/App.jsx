import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleExpenseAdded = (newExpense) => {
    console.log('New expense added:', newExpense);
    // Incrementing this trigger will help refresh our table/summary in future steps
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container">
      <header>
        <h1>Mini Expense Tracker</h1>
        <p>Manage your daily expenses with style and ease</p>
      </header>

      <div className="dashboard-grid">
        <ExpenseForm onExpenseAdded={handleExpenseAdded} />
        
        <div className="card">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            Expense List (Coming Next)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            We've set up the server proxy and the form component. In the next step, we will load and display the table of expenses here.
          </p>
        </div>
      </div>
    </div>
  );
}
