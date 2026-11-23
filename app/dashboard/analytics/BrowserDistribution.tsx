"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
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
  "#a3e635",
  "#38bdf8",
  "#fbbf24",
  "#c084fc",
  "#fb7185",
  "#34d399",
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

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <section className="rounded-3xl border border-border bg-card/60 p-5 shadow-xl shadow-black/10 sm:p-6">
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-lime-300">
          Technology
        </p>
        <h2 className="text-lg font-semibold tracking-tight">Browser mix</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Browsers used to access your link
        </p>
      </div>

      {loading ? (
        <div className="flex h-[290px] items-center justify-center">
          <div className="h-40 w-40 animate-pulse rounded-full border-[22px] border-muted/70" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-[290px] items-center justify-center rounded-2xl border border-dashed border-border bg-background/30 text-sm text-muted-foreground">
          No browser data available
        </div>
      ) : (
        <div className="relative h-[290px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="browser"
                cx="50%"
                cy="44%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={4}
                stroke="none"
                cornerRadius={5}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.browser}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#111821",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  color: "#f4f4f5",
                }}
                itemStyle={{ color: "#f4f4f5" }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-2xl font-bold tracking-tight">
              {total.toLocaleString()}
            </p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              visits
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
