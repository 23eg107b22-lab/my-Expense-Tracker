# 💰 Expense Tracker — Backend

REST API built with **Node.js + Express**. Stores data in local JSON files. No database required.

---

## 📁 Folder Structure

```
expense-tracker-backend/
├── server.js                    ← Entry point (run this)
├── package.json
├── routes/
│   ├── expenses.js              ← GET/POST/PUT/DELETE /expenses
│   └── budget.js                ← GET/POST /budget
├── controllers/
│   ├── expenseController.js     ← CRUD logic
│   ├── budgetController.js      ← Budget logic
│   └── storageController.js     ← File read/write + logging
└── data/                        ← Auto-created on first run
    ├── expenses.json            ← All expenses
    ├── budget.json              ← Monthly budget amount
    └── expenses.txt             ← Audit log (ADDED / REMOVED)
```

---

## 🚀 Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start
# → API running at http://localhost:5000

# (Optional) Dev mode with auto-reload
npm run dev
```

---

## 🌐 API Endpoints

| Method | URL               | Body                              | Description            |
|--------|-------------------|-----------------------------------|------------------------|
| GET    | /expenses         | —                                 | Get all expenses       |
| POST   | /expenses         | `{ amount, date, category, note }`| Add new expense        |
| PUT    | /expenses/:id     | `{ amount, date, category, note }`| Update expense         |
| DELETE | /expenses/:id     | —                                 | Delete expense         |
| GET    | /budget           | —                                 | Get monthly budget     |
| POST   | /budget           | `{ amount }`                      | Set monthly budget     |
| GET    | /health           | —                                 | Health check           |

### Valid categories: `FOOD` · `TRAVEL` · `SHOPPING` · `OTHER`

---

## 📦 Dependencies

| Package   | Purpose                        |
|-----------|--------------------------------|
| express   | HTTP server & routing          |
| cors      | Allow requests from frontend   |
| uuid      | Generate unique expense IDs    |
| nodemon   | Auto-reload on file change     |

---

## 📝 Notes

- Data files are created automatically in `./data/` on first start
- Default budget is ₹10,000 (editable via POST /budget or the frontend UI)
- Frontend must run on `http://localhost:5173` (CORS is set for that origin)
