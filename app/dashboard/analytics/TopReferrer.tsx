"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ReferrerData {
  referrer: string;
  count: number;
}

interface TopReferrersProps {
  urlId: number;
}

export default function TopReferrers({
  urlId,
}: TopReferrersProps) {
  const [data, setData] = useState<ReferrerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReferrerStats() {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/analytics/referrers?urlId=${urlId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch referrer stats");
        }

        const result = await response.json();

        setData(
          result.map((item: ReferrerData) => ({
            ...item,
            count: Number(item.count),
          }))
        );
      } catch (error) {
        console.error(
          "Failed to fetch referrer stats:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchReferrerStats();
  }, [urlId]);

  return (
    <div className="rounded-lg border border-border p-6 mt-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Top Referrers
        </h2>

        <p className="text-sm text-muted-foreground">
          Websites and sources sending visitors to your link
        </p>
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No referrer data available
        </div>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 5,
                right: 20,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
              />

              <XAxis
                type="number"
                allowDecimals={false}
              />

              <YAxis
                type="category"
                dataKey="referrer"
                width={100}
              />

              <Tooltip />

              <Bar
                dataKey="count"
                name="Visitors"
                fill="currentColor"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}