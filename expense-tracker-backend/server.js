const express = require("express");
const cors = require("cors");
const path = require("path");
const expenseRoutes = require("./routes/expenses");
const budgetRoutes = require("./routes/budget");
const { initDataFiles } = require("./controllers/storageController");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Initialize data files on startup
initDataFiles();

// Routes
app.use("/expenses", expenseRoutes);
app.use("/budget", budgetRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Expense Tracker API running at http://localhost:${PORT}`);
  console.log(`📁 Data stored in: ./data/\n`);
});
