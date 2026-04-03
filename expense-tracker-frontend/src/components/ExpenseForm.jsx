import React, { useState, useEffect } from "react";

const CATEGORIES = ["FOOD", "TRAVEL", "SHOPPING", "OTHER"];
const CATEGORY_ICONS = { FOOD: "🍔", TRAVEL: "✈️", SHOPPING: "🛍️", OTHER: "📦" };

const today = () => new Date().toISOString().split("T")[0];

const emptyForm = { amount: "", date: today(), category: "FOOD", note: "" };

export default function ExpenseForm({ onSubmit, editingExpense, onCancelEdit }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (editingExpense) {
      setForm({
        amount: String(editingExpense.amount),
        date: editingExpense.date,
        category: editingExpense.category,
        note: editingExpense.note || "",
      });
      setErrors({});
    }
  }, [editingExpense]);

  const validate = () => {
    const e = {};
    if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0)
      e.amount = "Enter a valid positive amount";
    if (!form.date) e.date = "Date is required";
    if (!form.category) e.category = "Select a category";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({ ...form, amount: parseFloat(form.amount) }, editingExpense?.id);
      setForm(emptyForm);
      setErrors({});
      showToast(editingExpense ? "Expense updated!" : "Expense added!");
    } catch (err) {
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setForm(emptyForm);
    setErrors({});
    if (editingExpense && onCancelEdit) onCancelEdit();
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.headerIcon}>{editingExpense ? "✏️" : "➕"}</span>
        <h2 style={styles.cardTitle}>{editingExpense ? "Edit Expense" : "Add Expense"}</h2>
      </div>

      {toast && (
        <div style={{ ...styles.toast, background: toast.type === "error" ? "#D32F2F" : "#388E3C" }}>
          {toast.type === "error" ? "⚠️" : "✅"} {toast.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Amount */}
        <div style={styles.field}>
          <label style={styles.label}>Amount (₹) *</label>
          <div style={styles.inputWrap}>
            <span style={styles.prefix}>₹</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={set("amount")}
              style={{ ...styles.input, ...styles.inputWithPrefix, ...(errors.amount ? styles.inputError : {}) }}
            />
          </div>
          {errors.amount && <span style={styles.errMsg}>{errors.amount}</span>}
        </div>

        {/* Date */}
        <div style={styles.field}>
          <label style={styles.label}>Date *</label>
          <input
            type="date"
            value={form.date}
            onChange={set("date")}
            max={today()}
            style={{ ...styles.input, ...(errors.date ? styles.inputError : {}) }}
          />
          {errors.date && <span style={styles.errMsg}>{errors.date}</span>}
        </div>

        {/* Category */}
        <div style={styles.field}>
          <label style={styles.label}>Category *</label>
          <div style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setForm((f) => ({ ...f, category: cat }))}
                style={{
                  ...styles.catBtn,
                  ...(form.category === cat ? styles.catBtnActive : {}),
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{CATEGORY_ICONS[cat]}</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.04em" }}>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div style={styles.field}>
          <label style={styles.label}>Note</label>
          <input
            type="text"
            placeholder="Optional description..."
            value={form.note}
            onChange={set("note")}
            maxLength={120}
            style={styles.input}
          />
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button type="button" onClick={handleClear} style={styles.btnSecondary}>
            🗑️ Clear
          </button>
          <button type="submit" disabled={submitting} style={{ ...styles.btnPrimary, opacity: submitting ? 0.7 : 1 }}>
            {submitting ? "Saving..." : editingExpense ? "💾 Update" : "➕ Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 16px rgba(63,81,181,0.10), 0 2px 6px rgba(63,81,181,0.08)",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "16px 20px",
    borderBottom: "1px solid #E8EAF6",
    background: "linear-gradient(135deg, #F5F6FF 0%, #FAFBFF 100%)",
  },
  headerIcon: { fontSize: "1.25rem" },
  cardTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#1A1A2E",
    letterSpacing: "-0.01em",
  },
  toast: {
    margin: "12px 20px 0",
    padding: "10px 14px",
    borderRadius: 8,
    color: "#fff",
    fontSize: "0.85rem",
    fontWeight: 500,
    animation: "fadeIn 0.2s ease",
  },
  form: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#5A5A7A",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: {
    position: "absolute",
    left: 12,
    color: "#3F51B5",
    fontWeight: 700,
    fontSize: "0.95rem",
    zIndex: 1,
    fontFamily: "'Space Mono', monospace",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #E2E5F5",
    borderRadius: 8,
    fontSize: "0.9rem",
    fontFamily: "inherit",
    color: "#1A1A2E",
    background: "#F8F9FF",
    outline: "none",
    transition: "border-color 0.18s, box-shadow 0.18s",
  },
  inputWithPrefix: { paddingLeft: 28 },
  inputError: { borderColor: "#D32F2F", background: "#FFF5F5" },
  errMsg: { fontSize: "0.75rem", color: "#D32F2F", fontWeight: 500 },
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
  },
  catBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    padding: "10px 6px",
    border: "1.5px solid #E2E5F5",
    borderRadius: 8,
    background: "#F8F9FF",
    color: "#5A5A7A",
    cursor: "pointer",
    transition: "all 0.18s",
    fontFamily: "inherit",
  },
  catBtnActive: {
    border: "1.5px solid #3F51B5",
    background: "#E8EAF6",
    color: "#3F51B5",
    boxShadow: "0 0 0 2px rgba(63,81,181,0.15)",
  },
  actions: {
    display: "flex",
    gap: 10,
    paddingTop: 4,
  },
  btnPrimary: {
    flex: 1,
    padding: "11px 16px",
    background: "#3F51B5",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: "0.9rem",
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "background 0.18s, transform 0.1s",
  },
  btnSecondary: {
    padding: "11px 16px",
    background: "#F8F9FF",
    color: "#5A5A7A",
    border: "1.5px solid #E2E5F5",
    borderRadius: 8,
    fontSize: "0.9rem",
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "background 0.18s",
  },
};
