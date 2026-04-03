import React, { useState, useMemo } from "react";

const CATEGORY_COLORS = {
  FOOD: { bg: "#E8F5E9", color: "#2E7D32", dot: "#388E3C" },
  TRAVEL: { bg: "#E3F2FD", color: "#1565C0", dot: "#1976D2" },
  SHOPPING: { bg: "#FCE4EC", color: "#C62828", dot: "#E53935" },
  OTHER: { bg: "#F3E5F5", color: "#6A1B9A", dot: "#8E24AA" },
};
const CATEGORY_ICONS = { FOOD: "🍔", TRAVEL: "✈️", SHOPPING: "🛍️", OTHER: "📦" };

const COLS = [
  { key: "date", label: "Date" },
  { key: "category", label: "Category" },
  { key: "note", label: "Note" },
  { key: "amount", label: "Amount (₹)" },
];

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState(null);

  const sorted = useMemo(() => {
    return [...expenses].sort((a, b) => {
      let va = a[sortKey];
      let vb = b[sortKey];
      if (sortKey === "amount") {
        va = parseFloat(va);
        vb = parseFloat(vb);
      } else {
        va = String(va).toLowerCase();
        vb = String(vb).toLowerCase();
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [expenses, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleRowClick = (id) => setSelected((s) => (s === id ? null : id));

  const handleEdit = () => {
    if (!selected) return;
    const exp = expenses.find((e) => e.id === selected);
    if (exp) onEdit(exp);
  };

  const handleDelete = () => {
    if (!selected) return;
    onDelete(selected);
    setSelected(null);
  };

  const fmt = (n) =>
    "₹" + parseFloat(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const fmtDate = (d) => {
    if (!d) return "-";
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const sortIcon = (key) => {
    if (sortKey !== key) return <span style={{ color: "#C5CAE9", marginLeft: 4 }}>⇅</span>;
    return <span style={{ color: "#3F51B5", marginLeft: 4 }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const total = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);

  return (
    <div style={styles.card}>
      {/* Card header */}
      <div style={styles.cardHeader}>
        <div style={styles.headerLeft}>
          <span style={{ fontSize: "1.1rem" }}>📋</span>
          <span style={styles.cardTitle}>All Expenses</span>
          <span style={styles.countBadge}>{expenses.length}</span>
        </div>
        <div style={styles.headerActions}>
          <button
            style={{ ...styles.actionBtn, ...styles.editActionBtn, opacity: selected ? 1 : 0.4 }}
            disabled={!selected}
            onClick={handleEdit}
          >
            ✏️ Edit
          </button>
          <button
            style={{ ...styles.actionBtn, ...styles.deleteActionBtn, opacity: selected ? 1 : 0.4 }}
            disabled={!selected}
            onClick={handleDelete}
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {selected && (
        <div style={styles.selectionBanner}>
          <span>✓ 1 row selected — use Edit or Delete above</span>
          <button style={styles.clearSelBtn} onClick={() => setSelected(null)}>✕ Clear</button>
        </div>
      )}

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={{ ...styles.th, width: 36 }}></th>
              {COLS.map((col) => (
                <th
                  key={col.key}
                  style={{ ...styles.th, cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label} {sortIcon(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={5} style={styles.empty}>
                  <div style={styles.emptyInner}>
                    <span style={{ fontSize: "2rem" }}>🧾</span>
                    <p style={{ fontWeight: 600, color: "#9E9EBE" }}>No expenses yet</p>
                    <p style={{ fontSize: "0.8rem", color: "#C5CAE9" }}>Add your first expense using the form →</p>
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((exp, idx) => {
                const isSelected = selected === exp.id;
                const catStyle = CATEGORY_COLORS[exp.category] || CATEGORY_COLORS.OTHER;
                return (
                  <tr
                    key={exp.id}
                    onClick={() => handleRowClick(exp.id)}
                    style={{
                      ...styles.tr,
                      background: isSelected ? "#E8EAF6" : idx % 2 === 0 ? "#fff" : "#FAFBFF",
                      outline: isSelected ? "2px solid #3F51B5" : "none",
                      outlineOffset: -2,
                    }}
                  >
                    <td style={styles.td}>
                      <div style={{ ...styles.radio, ...(isSelected ? styles.radioChecked : {}) }}>
                        {isSelected && <div style={styles.radioDot} />}
                      </div>
                    </td>
                    <td style={{ ...styles.td, fontFamily: "'Space Mono', monospace", fontSize: "0.8rem" }}>
                      {fmtDate(exp.date)}
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.catTag, background: catStyle.bg, color: catStyle.color }}>
                        {CATEGORY_ICONS[exp.category]} {exp.category}
                      </span>
                    </td>
                    <td style={{ ...styles.td, color: "#5A5A7A", maxWidth: 180 }}>
                      <span style={styles.noteText}>{exp.note || <em style={{ color: "#C5CAE9" }}>—</em>}</span>
                    </td>
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <span style={styles.amount}>{fmt(exp.amount)}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {sorted.length > 0 && (
            <tfoot>
              <tr style={styles.tfootRow}>
                <td colSpan={3} style={{ ...styles.td, fontWeight: 700, color: "#5A5A7A", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Total ({expenses.length} expense{expenses.length !== 1 ? "s" : ""})
                </td>
                <td />
                <td style={{ ...styles.td, textAlign: "right" }}>
                  <span style={{ ...styles.amount, color: "#3F51B5" }}>{fmt(total)}</span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 16px rgba(63,81,181,0.10), 0 2px 6px rgba(63,81,181,0.08)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    borderBottom: "1px solid #E8EAF6",
    background: "linear-gradient(135deg, #F5F6FF 0%, #FAFBFF 100%)",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 8 },
  cardTitle: { fontSize: "1rem", fontWeight: 700, color: "#1A1A2E" },
  countBadge: {
    background: "#3F51B5",
    color: "#fff",
    borderRadius: 20,
    padding: "1px 9px",
    fontSize: "0.72rem",
    fontWeight: 700,
  },
  headerActions: { display: "flex", gap: 8 },
  actionBtn: {
    padding: "6px 14px",
    borderRadius: 7,
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s",
  },
  editActionBtn: {
    background: "#E8EAF6",
    color: "#3F51B5",
    border: "1.5px solid #C5CAE9",
  },
  deleteActionBtn: {
    background: "#FFEBEE",
    color: "#D32F2F",
    border: "1.5px solid #FFCDD2",
  },
  selectionBanner: {
    background: "#E8EAF6",
    padding: "8px 20px",
    fontSize: "0.82rem",
    fontWeight: 500,
    color: "#3F51B5",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #C5CAE9",
  },
  clearSelBtn: {
    background: "none",
    border: "none",
    color: "#9E9EBE",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontFamily: "inherit",
  },
  tableWrap: { overflowX: "auto", flex: 1 },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#F5F6FF" },
  th: {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#5A5A7A",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    borderBottom: "1px solid #E8EAF6",
    whiteSpace: "nowrap",
  },
  tr: { cursor: "pointer", transition: "background 0.12s" },
  td: { padding: "11px 14px", fontSize: "0.875rem", color: "#1A1A2E", borderBottom: "1px solid #F0F2FF", verticalAlign: "middle" },
  radio: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    border: "2px solid #C5CAE9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "border-color 0.15s",
  },
  radioChecked: { border: "2px solid #3F51B5" },
  radioDot: { width: 7, height: 7, borderRadius: "50%", background: "#3F51B5" },
  catTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: "0.72rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
  },
  noteText: {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: 180,
    fontSize: "0.85rem",
  },
  amount: {
    fontFamily: "'Space Mono', monospace",
    fontWeight: 700,
    fontSize: "0.9rem",
    color: "#1A1A2E",
  },
  empty: { padding: "40px 20px", textAlign: "center" },
  emptyInner: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  tfootRow: { background: "#F5F6FF" },
};
