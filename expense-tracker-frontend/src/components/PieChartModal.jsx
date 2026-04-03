import React, { useEffect, useRef, useMemo } from "react";

const CATEGORY_COLORS = {
  FOOD:     { fill: "#388E3C", light: "#E8F5E9", label: "#1B5E20" },
  TRAVEL:   { fill: "#1976D2", light: "#E3F2FD", label: "#0D47A1" },
  SHOPPING: { fill: "#C62828", light: "#FFEBEE", label: "#7F0000" },
  OTHER:    { fill: "#7B1FA2", light: "#F3E5F5", label: "#4A148C" },
};
const CATEGORY_ICONS = { FOOD: "🍔", TRAVEL: "✈️", SHOPPING: "🛍️", OTHER: "📦" };

export default function PieChartModal({ expenses, onClose }) {
  const canvasRef = useRef(null);

  // Compute totals per category (current month)
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyExpenses = useMemo(
    () => expenses.filter((e) => e.date && e.date.startsWith(currentMonth)),
    [expenses, currentMonth]
  );

  const totals = useMemo(() => {
    const map = {};
    for (const e of monthlyExpenses) {
      map[e.category] = (map[e.category] || 0) + parseFloat(e.amount);
    }
    return Object.entries(map)
      .map(([cat, total]) => ({ cat, total }))
      .sort((a, b) => b.total - a.total);
  }, [monthlyExpenses]);

  const grandTotal = totals.reduce((s, t) => s + t.total, 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || totals.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(canvas.parentElement.offsetWidth, 300);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const outerR = size * 0.42;
    const innerR = size * 0.22; // donut hole

    let startAngle = -Math.PI / 2;
    const gap = 0.018; // gap between slices

    // Draw slices
    totals.forEach(({ cat, total }) => {
      const fraction = total / grandTotal;
      const sweep = fraction * 2 * Math.PI - gap;
      const color = CATEGORY_COLORS[cat]?.fill || "#9E9EBE";

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outerR, startAngle + gap / 2, startAngle + sweep + gap / 2);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Percentage label inside slice (only if slice is big enough)
      if (fraction > 0.08) {
        const midAngle = startAngle + gap / 2 + sweep / 2;
        const labelR = (outerR + innerR) / 2;
        const lx = cx + Math.cos(midAngle) * labelR;
        const ly = cy + Math.sin(midAngle) * labelR;
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.font = `bold ${Math.max(10, size * 0.052)}px 'Space Mono', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText((fraction * 100).toFixed(0) + "%", lx, ly);
      }

      startAngle += sweep + gap;
    });

    // Donut hole
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();

    // Center text
    ctx.fillStyle = "#1A1A2E";
    ctx.font = `bold ${Math.max(13, size * 0.065)}px 'Space Mono', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const fmt = (n) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
    ctx.fillText(fmt(grandTotal), cx, cy - size * 0.04);
    ctx.fillStyle = "#9E9EBE";
    ctx.font = `${Math.max(9, size * 0.04)}px 'DM Sans', sans-serif`;
    ctx.fillText("total spent", cx, cy + size * 0.05);
  }, [totals, grandTotal]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const fmt = (n) =>
    "₹" + parseFloat(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const monthName = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()} className="scale-in">
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>🥧 Expense Summary</h2>
            <p style={styles.subtitle}>{monthName} · Current Month</p>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        {totals.length === 0 ? (
          <div style={styles.empty}>
            <span style={{ fontSize: "3rem" }}>📭</span>
            <p style={{ fontWeight: 600, color: "#9E9EBE", marginTop: 12 }}>No expenses this month</p>
            <p style={{ fontSize: "0.82rem", color: "#C5CAE9" }}>Add some expenses to see your summary</p>
          </div>
        ) : (
          <div style={styles.body}>
            {/* Canvas Pie Chart */}
            <div style={styles.chartWrap}>
              <canvas ref={canvasRef} />
            </div>

            {/* Legend */}
            <div style={styles.legend}>
              {totals.map(({ cat, total }) => {
                const pct = ((total / grandTotal) * 100).toFixed(1);
                const c = CATEGORY_COLORS[cat] || { fill: "#9E9EBE", light: "#F5F5F5" };
                return (
                  <div key={cat} style={{ ...styles.legendItem, background: c.light }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ ...styles.legendDot, background: c.fill }} />
                      <span style={styles.legendCat}>
                        {CATEGORY_ICONS[cat]} {cat}
                      </span>
                    </div>
                    <div style={styles.legendRight}>
                      <span style={{ ...styles.legendAmt, color: c.fill }}>{fmt(total)}</span>
                      <span style={styles.legendPct}>{pct}%</span>
                    </div>
                  </div>
                );
              })}

              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Grand Total</span>
                <span style={styles.totalValue}>{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(26,26,46,0.6)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    background: "#fff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 500,
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "20px 24px 16px",
    borderBottom: "1px solid #E8EAF6",
    background: "linear-gradient(135deg, #F5F6FF 0%, #FAFBFF 100%)",
    borderRadius: "20px 20px 0 0",
    position: "sticky",
    top: 0,
    zIndex: 2,
  },
  title: { fontSize: "1.15rem", fontWeight: 700, color: "#1A1A2E" },
  subtitle: { fontSize: "0.78rem", color: "#9E9EBE", marginTop: 2 },
  closeBtn: {
    background: "#F0F2FF",
    border: "none",
    borderRadius: "50%",
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "0.85rem",
    color: "#5A5A7A",
    fontFamily: "inherit",
  },
  body: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    alignItems: "center",
  },
  chartWrap: {
    width: "100%",
    maxWidth: 280,
    display: "flex",
    justifyContent: "center",
  },
  legend: { width: "100%", display: "flex", flexDirection: "column", gap: 8 },
  legendItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    borderRadius: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
  },
  legendCat: {
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "#1A1A2E",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  legendRight: { display: "flex", alignItems: "center", gap: 10 },
  legendAmt: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.88rem",
    fontWeight: 700,
  },
  legendPct: {
    fontSize: "0.75rem",
    color: "#9E9EBE",
    fontFamily: "'Space Mono', monospace",
    minWidth: 40,
    textAlign: "right",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 14px",
    background: "#E8EAF6",
    borderRadius: 10,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "#3F51B5",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  totalValue: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#3F51B5",
  },
  empty: {
    padding: "48px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
};
