import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function NonfarmPayrolls() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/nonfarm-payrolls-change`)
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
      <h3>U.S. Nonfarm Payrolls (Last 36 months)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(val) => `${val}K`} />
          <Tooltip formatter={(val) => [`${val}K`, "Change"]} />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}

export default NonfarmPayrolls;
