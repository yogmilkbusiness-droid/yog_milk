"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

interface SimpleChartProps {
  data: DataPoint[];
  type?: "bar" | "line";
  height?: number;
  color?: string;
  secondaryColor?: string;
  dataKey?: string;
  secondaryDataKey?: string;
}

export function SimpleChart({
  data,
  type = "bar",
  height = 240,
  color = "#051256",
  secondaryColor = "#fc8127",
  dataKey = "value",
  secondaryDataKey,
}: SimpleChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === "bar" ? (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaedff" />
            <XAxis
              dataKey="label"
              stroke="#8e92a4"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#dde1f8" }}
            />
            <YAxis
              stroke="#8e92a4"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#dde1f8",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(5, 18, 86, 0.08)",
              }}
            />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            {secondaryDataKey && (
              <Bar dataKey={secondaryDataKey} fill={secondaryColor} radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaedff" />
            <XAxis
              dataKey="label"
              stroke="#8e92a4"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#dde1f8" }}
            />
            <YAxis
              stroke="#8e92a4"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#dde1f8",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(5, 18, 86, 0.08)",
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2.5}
              dot={{ r: 3, fill: color }}
              activeDot={{ r: 5 }}
            />
            {secondaryDataKey && (
              <Line
                type="monotone"
                dataKey={secondaryDataKey}
                stroke={secondaryColor}
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: secondaryColor }}
              />
            )}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

