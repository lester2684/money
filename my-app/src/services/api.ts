const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const fetchBalanceSheet = async (
  date: string,
  periods: number,
  timeframe: string
) => {
  try {
    const response = await fetch(
      `${API_URL}/api/balanceSheet?date=${date}&periods=${periods}&timeframe=${timeframe}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // Handle non-2xx responses
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
};
