import React from "react";

export default function Header({ onPieChart }) {
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <div style={styles.brand}>
          <span style={styles.logo}>💰</span>
          <div>
            <h1 style={styles.title}>My Expense Tracker</h1>
            <p style={styles.subtitle}>Track. Budget. Save.</p>
          </div>
        </div>
        <button style={styles.btn} onClick={onPieChart} onMouseEnter={e => e.currentTarget.style.background = '#283593'} onMouseLeave={e => e.currentTarget.style.background = '#3F51B5'}>
          <span style={{ fontSize: "1.1rem" }}>🥧</span>
          View Summary Pie Chart
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: "linear-gradient(135deg, #3F51B5 0%, #5C6BC0 50%, #3949AB 100%)",
    boxShadow: "0 4px 20px rgba(63,81,181,0.35)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "0 24px",
    height: 68,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  logo: {
    fontSize: "2rem",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
  },
  title: {
    color: "#fff",
    fontSize: "1.25rem",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
  },
  subtitle: {
    color: "rgba(255,255,255,0.65)",
    fontSize: "0.75rem",
    fontWeight: 400,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  btn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#3F51B5",
    color: "#fff",
    border: "1.5px solid rgba(255,255,255,0.3)",
    borderRadius: 8,
    padding: "9px 18px",
    fontSize: "0.875rem",
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "background 0.18s",
    letterSpacing: "0.01em",
  },
};
