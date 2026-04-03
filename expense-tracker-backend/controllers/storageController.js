const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");
const EXPENSES_FILE = path.join(DATA_DIR, "expenses.json");
const BUDGET_FILE = path.join(DATA_DIR, "budget.json");
const LOG_FILE = path.join(DATA_DIR, "expenses.txt");

// Initialize data files if they don't exist
function initDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log("📁 Created data directory");
  }

  if (!fs.existsSync(EXPENSES_FILE)) {
    fs.writeFileSync(EXPENSES_FILE, JSON.stringify([], null, 2));
    console.log("📄 Created expenses.json");
  }

  if (!fs.existsSync(BUDGET_FILE)) {
    fs.writeFileSync(BUDGET_FILE, JSON.stringify({ amount: 10000 }, null, 2));
    console.log("📄 Created budget.json");
  }

  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, "=== Expense Tracker Log ===\n\n");
    console.log("📄 Created expenses.txt log");
  }
}

// Read expenses
function readExpenses() {
  try {
    const data = fs.readFileSync(EXPENSES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading expenses:", err);
    return [];
  }
}

// Write expenses
function writeExpenses(expenses) {
  try {
    fs.writeFileSync(EXPENSES_FILE, JSON.stringify(expenses, null, 2));
    return true;
  } catch (err) {
    console.error("Error writing expenses:", err);
    return false;
  }
}

// Read budget
function readBudget() {
  try {
    const data = fs.readFileSync(BUDGET_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading budget:", err);
    return { amount: 10000 };
  }
}

// Write budget
function writeBudget(budget) {
  try {
    fs.writeFileSync(BUDGET_FILE, JSON.stringify(budget, null, 2));
    return true;
  } catch (err) {
    console.error("Error writing budget:", err);
    return false;
  }
}

// Append to log file
function appendLog(action, expense) {
  try {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${action} | ID: ${expense.id} | Amount: ₹${expense.amount} | Category: ${expense.category} | Note: ${expense.note || "N/A"} | Date: ${expense.date}\n`;
    fs.appendFileSync(LOG_FILE, logLine);
  } catch (err) {
    console.error("Error writing log:", err);
  }
}

module.exports = {
  initDataFiles,
  readExpenses,
  writeExpenses,
  readBudget,
  writeBudget,
  appendLog,
};
