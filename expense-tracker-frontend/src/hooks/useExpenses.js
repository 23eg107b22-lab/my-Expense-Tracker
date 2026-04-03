import { useState, useEffect, useCallback } from "react";
import { api } from "../api";

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudgetState] = useState(10000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [exp, bud] = await Promise.all([api.getExpenses(), api.getBudget()]);
      setExpenses(exp);
      setBudgetState(bud.amount);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addExpense = async (data) => {
    const created = await api.createExpense(data);
    setExpenses((prev) => [...prev, created]);
    return created;
  };

  const editExpense = async (id, data) => {
    const updated = await api.updateExpense(id, data);
    setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const removeExpense = async (id) => {
    await api.deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const updateBudget = async (amount) => {
    const result = await api.setBudget(amount);
    setBudgetState(result.amount);
    return result;
  };

  // Current month expenses only
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const monthlyExpenses = expenses.filter((e) => e.date && e.date.startsWith(currentMonth));
  const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  return {
    expenses,
    budget,
    loading,
    error,
    monthlyExpenses,
    monthlyTotal,
    addExpense,
    editExpense,
    removeExpense,
    updateBudget,
    reload: load,
  };
}
