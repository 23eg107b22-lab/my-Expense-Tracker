import React, { useState } from "react";

export default function BudgetPanel({ budget, monthlyTotal, onUpdateBudget }) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  const pct = budget > 0 ? (monthlyTotal / budget) * 100 : 0;
  const remaining = budget - monthlyTotal;

  let barColor = "#388E3C";
  let barBg = "#E8F5E9";
  let statusLabel = "On track";
  let statusColor = "#388E3C";
  if (pct >= 100) {
    barColor = "#D32F2F";
    barBg = "#FFEBEE";
    statusLabel = "Over budget!";
    statusColor = "#D32F2F";
  } else if (pct >= 80) {
    barColor = "#F57C00";
    barBg = "#FFF3E0";
    statusLabel = "Near limit";
    statusColor = "#F57C00";
  }

  const handleSave = async () => {
    const val = parseFloat(input);
    if (!val || val <= 0) return;
    setSaving(true);
    try {
      await onUpdateBudget(val);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const fmt = (n) =>
    "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const monthName = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <div style={styles.headerTop}>
            <span style={{ fontSize: "1.1rem" }}>📊</span>
            <span style={styles.title}>Monthly Budget</span>
            <span style={{ ...styles.badge, color: statusColor, background: barBg }}>
              {statusLabel}
            </span>
          </div>
          <div style={styles.month}>{monthName}</div>
        </div>
        <button style={styles.editBtn} onClick={() => { setInput(String(budget)); setEditing(true); }}>
          ✏️ Edit
        </button>
      </div>

      {editing ? (
        <div style={styles.editRow}>
          <div style={styles.inputWrap}>
            <span style={styles.prefix}>₹</span>
            <input
              type="number"
              min="1"
              step="100"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              style={styles.input}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false); }}
            />
          </div>
          <button onClick={handleSave} disabled={saving} style={styles.saveBtn}>
            {saving ? "..." : "Save"}
          </button>
          <button onClick={() => setEditing(false)} style={styles.cancelBtn}>✕</button>
        </div>
      ) : null}

      {/* Stats row */}
      <div style={styles.statsRow}>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Spent</span>
          <span style={{ ...styles.statValue, color: barColor }}>{fmt(monthlyTotal)}</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.stat}>
          <span style={styles.statLabel}>Budget</span>
          <span style={styles.statValue}>{fmt(budget)}</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.stat}>
          <span style={styles.statLabel}>{remaining >= 0 ? "Remaining" : "Over by"}</span>
          <span style={{ ...styles.statValue, color: remaining >= 0 ? "#388E3C" : "#D32F2F" }}>
            {fmt(Math.abs(remaining))}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={styles.progressSection}>
        <div style={{ ...styles.progressTrack, background: barBg }}>
          <div
            style={{
              ...styles.progressFill,
              width: `${Math.min(pct, 100)}%`,
              background: barColor,
              transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
            }}
          />
          {pct > 100 && (
            <div style={styles.overflowIndicator} />
          )}
        </div>
        <div style={styles.pctRow}>
          <span style={{ fontSize: "0.78rem", color: "#9E9EBE" }}>0%</span>
          <span style={{ ...styles.pctLabel, color: barColor }}>
            {pct.toFixed(1)}% used
          </span>
          <span style={{ fontSize: "0.78rem", color: "#9E9EBE" }}>100%</span>
        </div>
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
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "16px 20px 12px",
    borderBottom: "1px solid #E8EAF6",
    background: "linear-gradient(135deg, #F5F6FF 0%, #FAFBFF 100%)",
  },
  headerTop: { display: "flex", alignItems: "center", gap: 8 },
  title: { fontSize: "1rem", fontWeight: 700, color: "#1A1A2E" },
  badge: {
    fontSize: "0.7rem",
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: 20,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  month: { fontSize: "0.75rem", color: "#9E9EBE", marginTop: 2, paddingLeft: 28 },
  editBtn: {
    background: "none",
    border: "1.5px solid #E2E5F5",
    borderRadius: 6,
    padding: "4px 10px",
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "#3F51B5",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  editRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 20px",
    borderBottom: "1px solid #E8EAF6",
    background: "#FAFBFF",
  },
  inputWrap: { position: "relative", flex: 1 },
  prefix: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#3F51B5",
    fontWeight: 700,
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.9rem",
  },
  input: {
    width: "100%",
    padding: "8px 10px 8px 26px",
    border: "1.5px solid #3F51B5",
    borderRadius: 7,
    fontSize: "0.9rem",
    fontFamily: "'Space Mono', monospace",
    background: "#fff",
    color: "#1A1A2E",
    outline: "none",
  },
  saveBtn: {
    padding: "8px 14px",
    background: "#3F51B5",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  cancelBtn: {
    padding: "8px 10px",
    background: "#F8F9FF",
    color: "#9E9EBE",
    border: "1.5px solid #E2E5F5",
    borderRadius: 7,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  statsRow: {
    display: "flex",
    padding: "16px 20px",
    gap: 0,
  },
  stat: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 },
  statLabel: { fontSize: "0.72rem", fontWeight: 600, color: "#9E9EBE", textTransform: "uppercase", letterSpacing: "0.05em" },
  statValue: { fontSize: "1rem", fontWeight: 700, color: "#1A1A2E", fontFamily: "'Space Mono', monospace" },
  divider: { width: 1, background: "#E8EAF6", margin: "4px 0" },
  progressSection: { padding: "0 20px 20px" },
  progressTrack: {
    height: 12,
    borderRadius: 100,
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    borderRadius: 100,
    position: "relative",
  },
  overflowIndicator: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 3,
    height: "100%",
    background: "#D32F2F",
    animation: "pulse-ring 1s ease-out infinite",
  },
  pctRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  pctLabel: {
    fontSize: "0.82rem",
    fontWeight: 700,
    fontFamily: "'Space Mono', monospace",
  },
};
