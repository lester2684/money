import React, { useEffect, useState } from "react";
import { fetchBalanceSheet } from "../services/api";

const _BalanceSheet = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetchBalanceSheet().then(data => {
        setData(data);
        setLoading(false);
      }).catch(error =>setError(error))
      
    }
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error}</p>;

  console.log(data)
  return (
    <div>
      <h1>Fetched Data</h1>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
return (
    <div>
      <h1>Balance sheet</h1>
      <p>Welcome to our website!</p>
    </div>
);
}
const BalanceSheet = React.memo(_BalanceSheet);
export default BalanceSheet;