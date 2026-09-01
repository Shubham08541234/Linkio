"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ClickData {
  date: string;
  clicks: number;
  uniqueVisitors: number;
}

interface ClicksOverTimeProps {
  urlId: number;
}

export default function ClicksOverTime({ urlId }: ClicksOverTimeProps) {
  const [data, setData] = useState<ClickData[]>([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/analytics/clicks?urlId=${urlId}&days=${days}`,
        );

        const result = await response.json();

        setData(result);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [urlId, days]);

  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
  }));

  return (
    <div className="rounded-lg border border-border p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Clicks Over Time
          </h2>

          <p className="text-sm text-muted-foreground">
            Track how your link is performing
          </p>
        </div>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-md border border-border bg-black px-3 py-2 text-sm"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No click data available
        </div>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Legend />

              {/* Clicks */}
              <Line
                type="monotone"
                dataKey="clicks"
                name="Clicks"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />

              {/* Unique Visitors */}
              <Line
                type="monotone"
                dataKey="uniqueVisitors"
                name="Unique Visitors"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
