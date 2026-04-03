const { v4: uuidv4 } = require("uuid");
const {
  readExpenses,
  writeExpenses,
  appendLog,
} = require("./storageController");

const VALID_CATEGORIES = ["FOOD", "TRAVEL", "SHOPPING", "OTHER"];

// GET /expenses
function getAllExpenses(req, res) {
  try {
    const expenses = readExpenses();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to read expenses", message: err.message });
  }
}

// POST /expenses
function createExpense(req, res) {
  try {
    const { amount, date, category, note } = req.body;

    // Validation
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: "Invalid amount. Must be a positive number." });
    }
    if (!category || !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}` });
    }

    const newExpense = {
      id: uuidv4(),
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      date: date || new Date().toISOString().split("T")[0],
      category: category,
      note: note ? note.trim() : "",
      createdAt: new Date().toISOString(),
    };

    const expenses = readExpenses();
    expenses.push(newExpense);

    if (!writeExpenses(expenses)) {
      return res.status(500).json({ error: "Failed to save expense" });
    }

    appendLog("ADDED", newExpense);
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ error: "Failed to create expense", message: err.message });
  }
}

// PUT /expenses/:id
function updateExpense(req, res) {
  try {
    const { id } = req.params;
    const { amount, date, category, note } = req.body;

    const expenses = readExpenses();
    const index = expenses.findIndex((e) => e.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Expense not found" });
    }

    // Validation
    if (amount !== undefined && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)) {
      return res.status(400).json({ error: "Invalid amount. Must be a positive number." });
    }
    if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}` });
    }

    const updatedExpense = {
      ...expenses[index],
      amount: amount !== undefined ? parseFloat(parseFloat(amount).toFixed(2)) : expenses[index].amount,
      date: date || expenses[index].date,
      category: category || expenses[index].category,
      note: note !== undefined ? note.trim() : expenses[index].note,
      updatedAt: new Date().toISOString(),
    };

    expenses[index] = updatedExpense;

    if (!writeExpenses(expenses)) {
      return res.status(500).json({ error: "Failed to update expense" });
    }

    res.json(updatedExpense);
  } catch (err) {
    res.status(500).json({ error: "Failed to update expense", message: err.message });
  }
}

// DELETE /expenses/:id
function deleteExpense(req, res) {
  try {
    const { id } = req.params;
    const expenses = readExpenses();
    const index = expenses.findIndex((e) => e.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Expense not found" });
    }

    const [removed] = expenses.splice(index, 1);

    if (!writeExpenses(expenses)) {
      return res.status(500).json({ error: "Failed to delete expense" });
    }

    appendLog("REMOVED", removed);
    res.json({ message: "Expense deleted successfully", deleted: removed });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete expense", message: err.message });
  }
}

module.exports = { getAllExpenses, createExpense, updateExpense, deleteExpense };
