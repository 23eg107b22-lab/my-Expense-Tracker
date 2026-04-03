const BASE = "";

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  getExpenses: () => fetch(`${BASE}/expenses`).then(handleResponse),

  createExpense: (expense) =>
    fetch(`${BASE}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    }).then(handleResponse),

  updateExpense: (id, expense) =>
    fetch(`${BASE}/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    }).then(handleResponse),

  deleteExpense: (id) =>
    fetch(`${BASE}/expenses/${id}`, { method: "DELETE" }).then(handleResponse),

  getBudget: () => fetch(`${BASE}/budget`).then(handleResponse),

  setBudget: (amount) =>
    fetch(`${BASE}/budget`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    }).then(handleResponse),
};
