import { useEffect, useState } from "react";

function EconomySection() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/economy`)
      .then((res) => res.json())
      .then((data) => {
        console.log("fetched data:", data);
        setData(data);
      })
      .catch((error) => {
        console.error("fetch error:", error);
      });
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <section>
      <h2>Current U.S. Economic Snapshot</h2>
      <ul>
        <li>
          <strong>Unemployment Rate:</strong> {data.unemployment_rate.value}%
          (as of {data.unemployment_rate.date})
        </li>
        <li>
          <strong>Nonfarm Payrolls:</strong>{" "}
          {parseInt(data.nonfarm_payrolls.value).toLocaleString()} jobs (as of{" "}
          {data.nonfarm_payrolls.date})
        </li>
        <li>
          <strong>GDP Growth QoQ:</strong> {data.gdp_growth_qoq.value}% (as of{" "}
          {data.gdp_growth_qoq.date})
        </li>
      </ul>
    </section>
  );
}

export default EconomySection;
