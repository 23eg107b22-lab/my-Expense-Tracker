import React, { useState } from "react";
import Header from "./components/Header";
import ExpenseTable from "./components/ExpenseTable";
import ExpenseForm from "./components/ExpenseForm";
import BudgetPanel from "./components/BudgetPanel";
import PieChartModal from "./components/PieChartModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import { useExpenses } from "./hooks/useExpenses";

export default function App() {
  const {
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
  } = useExpenses();

  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [showPie, setShowPie] = useState(false);

  const handleSubmit = async (data, id) => {
    if (id) {
      await editExpense(id, data);
      setEditingExpense(null);
    } else {
      await addExpense(data);
    }
  };

  const handleDeleteRequest = (idOrExpense) => {
    const exp =
      typeof idOrExpense === "string"
        ? expenses.find((e) => e.id === idOrExpense)
        : idOrExpense;
    setDeletingExpense(exp);
  };

  const handleDeleteConfirm = async (id) => {
    await removeExpense(id);
    setDeletingExpense(null);
  };

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading Expense Tracker...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.loadingScreen}>
        <div style={{ ...styles.loadingCard, gap: 12 }}>
          <span style={{ fontSize: "2.5rem" }}>⚠️</span>
          <p style={{ color: "#D32F2F", fontWeight: 700, fontSize: "1rem" }}>Could not connect to server</p>
          <p style={{ color: "#9E9EBE", fontSize: "0.85rem", textAlign: "center" }}>{error}</p>
          <p style={{ color: "#C5CAE9", fontSize: "0.78rem" }}>Make sure the backend is running on port 5000</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <Header onPieChart={() => setShowPie(true)} />

      <main style={styles.main}>
        <div style={styles.layout}>
          {/* Left: Table */}
          <div style={styles.left}>
            <ExpenseTable
              expenses={expenses}
              onEdit={setEditingExpense}
              onDelete={handleDeleteRequest}
            />
          </div>

          {/* Right: Budget + Form */}
          <div style={styles.right}>
            <BudgetPanel
              budget={budget}
              monthlyTotal={monthlyTotal}
              onUpdateBudget={updateBudget}
            />
            <ExpenseForm
              onSubmit={handleSubmit}
              editingExpense={editingExpense}
              onCancelEdit={() => setEditingExpense(null)}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      {showPie && (
        <PieChartModal
          expenses={expenses}
          onClose={() => setShowPie(false)}
        />
      )}
      {deletingExpense && (
        <ConfirmDeleteModal
          expense={deletingExpense}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingExpense(null)}
        />
      )}
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#F0F2FF",
  },
  main: {
    flex: 1,
    padding: "24px 24px 40px",
    maxWidth: 1400,
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: 20,
    alignItems: "start",
  },
  left: { minWidth: 0 },
  right: { display: "flex", flexDirection: "column", gap: 16 },
  loadingScreen: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#F0F2FF",
  },
  loadingCard: {
    background: "#fff",
    borderRadius: 16,
    padding: "40px 48px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    boxShadow: "0 4px 24px rgba(63,81,181,0.12)",
  },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid #E8EAF6",
    borderTop: "3px solid #3F51B5",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    color: "#5A5A7A",
    fontWeight: 500,
    fontSize: "0.95rem",
  },
};
