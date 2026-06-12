import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import FilterBar from './components/FilterBar';
import ExpenseChart from './components/ExpenseChart';
import SummaryPanel from './components/SummaryPanel';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summaryData, setSummaryData] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: ''
  });

  const fetchSummary = async () => {
    try {
      const response = await fetch('/api/expenses/summary');
      if (response.ok) {
        const data = await response.json();
        setSummaryData(data);
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  // Fetch list of expenses from database
  const fetchExpenses = async (appliedFilters = filters) => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams();
      if (appliedFilters.category) {
        queryParams.append('category', appliedFilters.category);
      }
      if (appliedFilters.startDate) {
        queryParams.append('startDate', appliedFilters.startDate);
      }
      if (appliedFilters.endDate) {
        queryParams.append('endDate', appliedFilters.endDate);
      }

      const response = await fetch(`/api/expenses?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(err.message || 'Something went wrong while loading expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  const handleExpenseSaved = () => {
    fetchExpenses();
    fetchSummary();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchExpenses(newFilters);
  };

  const handleEditSelect = (expense) => {
    setEditingExpense(expense);
    // Scroll window smoothly to the top of the form for better mobile/UX experience
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete');
      }

      // Re-fetch list
      fetchExpenses();
      fetchSummary();

      // If the deleted item was currently being edited, cancel edit state
      if (editingExpense && editingExpense._id === id) {
        setEditingExpense(null);
      }
    } catch (err) {
      alert(err.message || 'Error deleting expense');
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Mini Expense Tracker</h1>
        <p>Manage your daily expenses with style and ease</p>
      </header>

      {error && (
        <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          <span>{error}</span>
        </div>
      )}

      <SummaryPanel summaryData={summaryData} />

      <div className="dashboard-grid">
        <ExpenseForm
          onExpenseAdded={handleExpenseSaved}
          editingExpense={editingExpense}
          onCancelEdit={handleCancelEdit}
        />

        <div className="main-content-area" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <FilterBar filters={filters} onFilterChange={handleFilterChange} />

          <ExpenseChart expenses={expenses} />

          {loading ? (
            <div className="card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
              <p style={{ color: 'var(--text-muted)' }}>Loading expenses...</p>
            </div>
          ) : (
            <ExpenseTable
              expenses={expenses}
              onEditSelect={handleEditSelect}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
