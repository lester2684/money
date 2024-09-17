const API_URL = "http://localhost:3000";

export const fetchBalanceSheet = async () => {
  const response = await fetch(`${API_URL}/api.xro/2.0/Reports/BalanceSheet`);
  if (!response.ok) {
    throw new Error("Error fetching data");
  }
  return response.json();
};
