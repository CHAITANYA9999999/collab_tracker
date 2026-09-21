"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Point {
  label: string;
  collabs: number;
  earnings: number;
}

export function TrendChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#e8d9ca" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#6f6259", fontSize: 12 }} />
        <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fill: "#6f6259", fontSize: 12 }} />
        <YAxis yAxisId="right" orientation="right" hide />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #f3ddce",
            fontSize: 13,
          }}
          formatter={(value: number, name: string) =>
            name === "earnings" ? [`₹${value.toLocaleString("en-IN")}`, "Earnings"] : [value, "Collabs"]
          }
        />
        <Bar yAxisId="left" dataKey="collabs" fill="#f3ddce" radius={[8, 8, 0, 0]} barSize={28} />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="earnings"
          stroke="#c9622f"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#c9622f" }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
