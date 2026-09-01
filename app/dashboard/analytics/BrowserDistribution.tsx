"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface BrowserData {
  browser: string;
  count: number;
}

interface BrowserDistributionProps {
  urlId: number;
}

const COLORS = [
  "#60a5fa",
  "#34d399",
  "#fbbf24",
  "#f87171",
  "#a78bfa",
  "#fb7185",
];

export default function BrowserDistribution({
  urlId,
}: BrowserDistributionProps) {
  const [data, setData] = useState<BrowserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrowserStats() {
      setLoading(true);

      try {
        const response = await fetch(`/api/analytics/browsers?urlId=${urlId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch browser stats");
        }

        const result = await response.json();

        setData(
          result.map((item: BrowserData) => ({
            ...item,
            count: Number(item.count),
          })),
        );
      } catch (error) {
        console.error("Failed to fetch browser stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBrowserStats();
  }, [urlId]);

  const renderShape = (props: any) => {
    const { index, ...rest } = props;

    return <Sector {...rest} fill={COLORS[index % COLORS.length]} />;
  };

  return (
    <div className="rounded-lg border border-border p-6 mt-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Browser Distribution</h2>

        <p className="text-sm text-muted-foreground">
          Browsers used to access your link
        </p>
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No browser data available
        </div>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="browser"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
                shape={renderShape}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.browser}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
