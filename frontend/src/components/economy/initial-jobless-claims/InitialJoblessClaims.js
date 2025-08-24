import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function InitialJoblessClaimChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/initial-jobless-claims`)
      .then((res) => res.json())
      .then((data) => {
        const parsed = data.map((d) => ({
          date: d.date,
          value: parseFloat(d.value),
        }));

        // reverse to match jobless chart direction (oldest to newest)
        parsed.reverse();

        setData(parsed);
      })
      .catch((error) => console.error("fetch error:", error));
  }, []);

  return (
    <section style={{ marginTop: "2rem" }}>
      <h3>Initial Jobless Claims (Last 52 weeks)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          width="100%"
          height={300}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            domain={["dataMin - 10000", "dataMax + 10000"]}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <Tooltip formatter={(v) => v.toLocaleString()} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            dot={{ r: 2 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}

export default InitialJoblessClaimChart;
