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

function ContinuingClaimsChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/continuing-claims-trend`)
      .then((res) => res.json())
      .then((resData) => {
        // Sort ascending by date
        const sorted = [...resData].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        // Convert values to integers
        const formatted = sorted.map((item) => ({
          ...item,
          value: parseInt(item.value),
        }));
        setData(formatted);
      });
  }, []);

  return (
    <section style={{ marginTop: "2rem" }}>
      <h3>Continuing Jobless Claims (Last 52 Weeks)</h3>
      <ResponsiveContainer width="100%" height={300}>
        {/* <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis
            domain={[0, "auto"]}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 2 }}
          />
        </LineChart> */}
        <LineChart
          width={800}
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

export default ContinuingClaimsChart;
