const { readBudget, writeBudget } = require("./storageController");

// GET /budget
function getBudget(req, res) {
  try {
    const budget = readBudget();
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: "Failed to read budget", message: err.message });
  }
}

// POST /budget
function setBudget(req, res) {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: "Invalid budget amount. Must be a positive number." });
    }

    const budget = { amount: parseFloat(parseFloat(amount).toFixed(2)) };

    if (!writeBudget(budget)) {
      return res.status(500).json({ error: "Failed to save budget" });
    }

    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: "Failed to set budget", message: err.message });
  }
}

module.exports = { getBudget, setBudget };
