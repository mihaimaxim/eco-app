import { useEffect, useState } from "react";

import ContinuingClaimsChart from "./continuing-jobless-claims/ContinuingJoblessClaims";
import UnemploymentChart from "./unemployment/UnemploymentChart.js";
import NonfarmPayrolls from "./nonfarm/NonfarmPayrolls.js";
import InitialJoblessClaimChart from "./initial-jobless-claims/InitialJoblessClaims.js";

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
        {data.unemployment_rate && (
          <li>
            <strong>Unemployment Rate:</strong>{" "}
            {data.unemployment_rate[0].value}% (as of{" "}
            {data.unemployment_rate[0].date})
          </li>
        )}
        {data.nonfarm_payrolls && (
          <li>
            <strong>Nonfarm Payrolls Total:</strong>{" "}
            {data.nonfarm_payrolls[0].value.toLocaleString()} jobs (as of{" "}
            {data.nonfarm_payrolls[0].date})
          </li>
        )}
        {data.gdp_growth_qoq && (
          <li>
            <strong>GDP Growth QoQ:</strong> {data.gdp_growth_qoq[0].value}% (as
            of {data.gdp_growth_qoq[0].date})
          </li>
        )}
        {data.initial_jobless_claims && (
          <li>
            <strong>Initial Jobless Claims:</strong>{" "}
            {parseInt(data.initial_jobless_claims[0].value).toLocaleString()}{" "}
            (as of {data.initial_jobless_claims[0].date})
          </li>
        )}

        {data.continuing_jobless_claims && (
          <li>
            <strong>Continuing Jobless Claims:</strong>{" "}
            {parseInt(data.continuing_jobless_claims[0].value).toLocaleString()}{" "}
            (as of {data.continuing_jobless_claims[0].date})
          </li>
        )}
      </ul>
      <UnemploymentChart />
      <NonfarmPayrolls />
      <InitialJoblessClaimChart />
      <ContinuingClaimsChart />
    </section>
  );
}

export default EconomySection;
