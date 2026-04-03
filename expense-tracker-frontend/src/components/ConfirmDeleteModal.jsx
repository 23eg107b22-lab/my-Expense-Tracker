import React, { useEffect } from "react";

export default function ConfirmDeleteModal({ expense, onConfirm, onCancel }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  if (!expense) return null;

  const fmt = (n) =>
    "₹" + parseFloat(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()} className="scale-in">
        <div style={styles.iconWrap}>
          <span style={styles.icon}>🗑️</span>
        </div>
        <h2 style={styles.title}>Delete Expense?</h2>
        <p style={styles.sub}>This action cannot be undone.</p>

        <div style={styles.details}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Amount</span>
            <span style={styles.detailValue}>{fmt(expense.amount)}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Category</span>
            <span style={styles.detailValue}>{expense.category}</span>
          </div>
          {expense.note && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Note</span>
              <span style={styles.detailValue}>{expense.note}</span>
            </div>
          )}
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Date</span>
            <span style={styles.detailValue}>{expense.date}</span>
          </div>
        </div>

        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button style={styles.deleteBtn} onClick={() => onConfirm(expense.id)}>
            🗑️ Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(26,26,46,0.55)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    background: "#fff",
    borderRadius: 16,
    padding: "32px 28px 24px",
    width: "100%",
    maxWidth: 380,
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "#FFEBEE",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  icon: { fontSize: "1.8rem" },
  title: { fontSize: "1.2rem", fontWeight: 700, color: "#1A1A2E", textAlign: "center" },
  sub: { fontSize: "0.85rem", color: "#9E9EBE", textAlign: "center", marginBottom: 8 },
  details: {
    width: "100%",
    background: "#F8F9FF",
    borderRadius: 10,
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    border: "1px solid #E8EAF6",
    margin: "8px 0 16px",
  },
  detailRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  detailLabel: { fontSize: "0.78rem", color: "#9E9EBE", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" },
  detailValue: { fontSize: "0.88rem", color: "#1A1A2E", fontWeight: 600, fontFamily: "'Space Mono', monospace" },
  actions: { display: "flex", gap: 10, width: "100%" },
  cancelBtn: {
    flex: 1,
    padding: "11px",
    background: "#F8F9FF",
    color: "#5A5A7A",
    border: "1.5px solid #E2E5F5",
    borderRadius: 8,
    fontSize: "0.9rem",
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
  },
  deleteBtn: {
    flex: 1,
    padding: "11px",
    background: "#D32F2F",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: "0.9rem",
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
  },
};
