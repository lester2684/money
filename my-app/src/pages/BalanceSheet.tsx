import React, { useEffect, useState } from "react";
import { fetchBalanceSheet } from "../services/api";
import { balanceSheetData, report } from "../types/types";
import XeroReport from "../components/XeroReport";

const _BalanceSheet = () => {
  const [data, setData] = useState<balanceSheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<report | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBalanceSheet();
        setData(data); 
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false);
      }
    };
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
      <XeroReport reportData={report} />
    </>
  );
};

const BalanceSheet = React.memo(_BalanceSheet);
export default BalanceSheet;
