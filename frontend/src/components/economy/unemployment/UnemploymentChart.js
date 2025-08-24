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

function UnemploymentChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/unemployment-trend`)
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
      <h3>Unemployment (Last 3 years)</h3>
      <ResponsiveContainer width="100%" height={300}>
        {data && (
          <LineChart width={500} height={300} data={data}>
            <XAxis dataKey="date" />
            <YAxis domain={["dataMin", "dataMax"]} />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
          </LineChart>
        )}
      </ResponsiveContainer>
    </section>
  );
}

export default UnemploymentChart;
