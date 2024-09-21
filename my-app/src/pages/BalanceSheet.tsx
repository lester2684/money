import React, { useEffect, useState } from "react";
import { fetchBalanceSheet } from "../services/api";
import { balanceSheetData, report } from "../types/types";
import XeroReport from "../components/XeroReport";
import { formatDate } from "../utils/dateTime";

const _BalanceSheet = () => {
  const [data, setData] = useState<balanceSheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<report | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
  const [selectedTimeFrame, setTimeFrame] = useState<string>("MONTH");

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(Number(event.target.value));
  };

  const handleTimeFrameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeFrame(event.target.value);
  };

  const fetchData = async () => {
    try {
      const data = await fetchBalanceSheet(selectedDate, selectedPeriod, selectedTimeFrame);
      setData(data); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchData();
  };

  useEffect(() => {
    
    fetchData();
  }, []);

  useEffect(() => {
    if (data?.Reports?.[0]) {
      setReport(data.Reports[0]);
      setError(null)
    }
    else{
      setError('An error occurred')
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error}</p>;
  if (!report) return <p>The report cannot be found.</p>;

  return (
    <>
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
        <label htmlFor="period-select">Select a periods (1-11): </label>
        <select
          id="period-select"
          value={selectedPeriod}
          onChange={handlePeriodChange}>
          {[...Array.from({ length: 11 }, (_, i) => i + 1)].map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
      </div>
      <div className="timeFrame-picker">
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
      <XeroReport reportData={report} />
    </>
  );
};

const BalanceSheet = React.memo(_BalanceSheet);
export default BalanceSheet;
