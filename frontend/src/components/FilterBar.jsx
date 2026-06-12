import React from 'react';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'];

export default function FilterBar({ filters, onFilterChange }) {
  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const handleReset = () => {
    onFilterChange({
      category: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="card filter-card">
      <div className="filter-bar">
        <div className="form-group">
          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            className="form-control"
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="filter-start-date">From Date</label>
          <input
            type="date"
            id="filter-start-date"
            className="form-control"
            value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="filter-end-date">To Date</label>
          <input
            type="date"
            id="filter-end-date"
            className="form-control"
            value={filters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </div>

        {(filters.category || filters.startDate || filters.endDate) && (
          <button
            type="button"
            className="btn-reset"
            onClick={handleReset}
            title="Clear all filters"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
