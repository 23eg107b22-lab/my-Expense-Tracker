# 💰 Expense Tracker — Frontend

React + Vite UI for the Expense Tracker app. Talks to the backend API at `http://localhost:5000`.

---

## 📁 Folder Structure

```
expense-tracker-frontend/
├── index.html
├── vite.config.js               ← Proxies /expenses & /budget to :5000
├── package.json
└── src/
    ├── main.jsx                 ← React entry point
    ├── App.jsx                  ← Root layout + state wiring
    ├── api.js                   ← All fetch() calls to backend
    ├── index.css                ← Global styles + CSS variables
    ├── hooks/
    │   └── useExpenses.js       ← Shared state hook
    └── components/
        ├── Header.jsx           ← App header + Pie Chart button
        ├── ExpenseForm.jsx      ← Add / Edit expense form
        ├── ExpenseTable.jsx     ← Sortable, selectable table
        ├── BudgetPanel.jsx      ← Budget progress bar
        ├── PieChartModal.jsx    ← Canvas donut chart (no libraries)
        └── ConfirmDeleteModal.jsx
```

---

## 🚀 Setup & Run

> ⚠️ Make sure the **backend is already running** on port 5000 before starting this.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
# → App running at http://localhost:5173
```

### Build for production
```bash
npm run build
npm run preview
```

---

## 🎨 Theme

| Token    | Value     | Used for                     |
|----------|-----------|------------------------------|
| Primary  | `#3F51B5` | Buttons, highlights, accents |
| Success  | `#388E3C` | Budget OK, positive states   |
| Danger   | `#D32F2F` | Delete, over-budget state    |
| Warning  | `#F57C00` | Near-limit budget state      |

---

## 📦 Dependencies

| Package        | Purpose                     |
|----------------|-----------------------------|
| react          | UI framework                |
| react-dom      | DOM rendering               |
| vite           | Dev server + bundler        |
| @vitejs/plugin-react | JSX transform          |

> No chart libraries. The pie chart is drawn with native HTML5 Canvas.

---

## 🔌 How the Proxy Works

`vite.config.js` proxies these paths to the backend automatically:

```
/expenses  →  http://localhost:5000/expenses
/budget    →  http://localhost:5000/budget
/health    →  http://localhost:5000/health
```

This means **no CORS issues** and no hardcoded backend URL in the code.
