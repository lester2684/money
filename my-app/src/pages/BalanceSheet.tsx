import React, { useEffect, useState, useCallback } from "react";
import { fetchBalanceSheet } from "../services/api";
import { balanceSheetData, report } from "../types/types";
import XeroReport from "../components/XeroReport";
import { formatDate } from "../utils/dateTime";

const _BalanceSheet = () => {
  // State variables
  const [data, setData] = useState<balanceSheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<report | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
  const [selectedTimeFrame, setTimeFrame] = useState<string>("MONTH");

  // Event handlers
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const period = Number(event.target.value);
    if (period >= 1 && period <= 11) {
      setSelectedPeriod(period);
    } else {
      setError("Period must be between 1 and 11.");
    }
  };

  const handleTimeFrameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeFrame(event.target.value);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedData = await fetchBalanceSheet(selectedDate, selectedPeriod, selectedTimeFrame);
      setData(fetchedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedPeriod, selectedTimeFrame]);

  const handleSearch = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (data?.Reports?.[0]) {
      setReportData(data.Reports[0]);
      setError(null);
    } else {
      setError("No reports found.");
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!reportData) return <p>No report data available.</p>;

  return (
    <>
      <div className="filters">
      <div className="date-picker">
        <label htmlFor="report-date">Select Date: </label>
        <input
          type="date"
          id="report-date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
      <div className="period-picker">
        <label htmlFor="period-select">Select Period (1-11): </label>
        <select
          id="period-select"
          value={selectedPeriod}
          onChange={handlePeriodChange}
        >
          {[...Array.from({ length: 11 }, (_, i) => i + 1)].map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
      </div>
      <div className="time-frame-picker">
        <label htmlFor="timeFrame-select">Select Timeframe: </label>
        <select
          id="timeFrame-select"
          value={selectedTimeFrame}
          onChange={handleTimeFrameChange}
        >
          <option value="MONTH">MONTH</option>
          <option value="QUARTER">QUARTER</option>
          <option value="YEAR">YEAR</option>
        </select>
      </div>
      <div className="search-button">
        <button onClick={handleSearch}>Search</button>
      </div>
      </div>
      
      <XeroReport reportData={reportData} />
    </>
  );
};

const BalanceSheet = React.memo(_BalanceSheet);
export default BalanceSheet;
