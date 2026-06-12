# Mini Expense Tracker

A full-stack Expense Tracker application built with React, Vite, Node.js, Express, MongoDB Atlas, and Mongoose. The application allows users to track expenses, manage budgets, view spending summaries, and visualize expenses through charts.

## Features

* Add and manage expenses
* Set and track budgets
* View expense summaries
* Filter expenses
* Visualize spending trends with charts
* Persistent data storage using MongoDB Atlas
* Responsive user interface

---

## Tech Stack

### Frontend

* React
* Vite
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

---

## Project Structure

```text
expense_tracker/
├── backend/
│   ├── .env
│   ├── config/
│   ├── controllers/
│   ├── index.js
│   ├── models/
│   ├── package-lock.json
│   └── package.json
│
└── frontend/
    ├── dist/
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── BudgetPanel.jsx
    │   │   ├── ExpenseChart.jsx
    │   │   ├── ExpenseForm.jsx
    │   │   ├── ExpenseTable.jsx
    │   │   ├── FilterBar.jsx
    │   │   └── SummaryPanel.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── vercel.json
    └── vite.config.js
```

---

## Running the Project Locally

### Prerequisites

* Node.js
* npm
* MongoDB Atlas database

### Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and add:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

Start the backend server:

```bash
node index.js
```

---

### Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will typically run on:

```text
http://localhost:5173
```

---

## What Works

* Creating expenses
* Viewing expenses
* Expense filtering
* Budget tracking
* Expense summaries
* Expense charts and visualization
* MongoDB Atlas database integration
* Frontend and backend communication

---

## Known Limitations

* Input validation can be improved.
* Error messages are basic in some scenarios.
* User authentication is not implemented.
* The application currently supports a single shared dataset rather than multiple user accounts.
* Additional testing would improve reliability.

---

## What I Would Improve With More Time

* Add authentication and user-specific accounts.
* Add recurring expenses and budget alerts.
* Improve form validation and error handling.
* Add automated unit and integration tests.
* Improve accessibility and mobile responsiveness.
* Add export functionality (CSV/PDF).
* Improve overall UI/UX polish.
* Add pagination and more advanced filtering options.

---

## AI Usage Disclosure

Google Gemini was used as a development aid for:

* CSS styling suggestions
* Assistance with some syntax errors
* General debugging support

All application architecture, feature implementation, integration, and final development decisions were completed and reviewed by me.

---

## Author

Sumit Kumar
