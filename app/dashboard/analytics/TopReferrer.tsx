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
    <section className="rounded-3xl border border-border bg-card/60 p-5 shadow-xl shadow-black/10 sm:p-6">
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-violet-300">
          Discovery
        </p>
        <h2 className="text-lg font-semibold tracking-tight">Top referrers</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Websites and sources sending visitors to your link
        </p>
      </div>

      {loading ? (
        <div className="flex h-[290px] flex-col justify-center gap-4 px-5">
          {[90, 72, 56, 42].map((width, index) => (
            <div
              key={index}
              className="h-5 animate-pulse rounded-full bg-muted/70"
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-[290px] items-center justify-center rounded-2xl border border-dashed border-border bg-background/30 text-sm text-muted-foreground">
          No referrer data available
        </div>
      ) : (
        <div className="h-[290px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 5,
                right: 16,
                left: 8,
                bottom: 5,
              }}
              barCategoryGap={12}
            >
              <defs>
                <linearGradient
                  id="referrerBarGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="rgba(255,255,255,0.07)"
                horizontal={false}
                strokeDasharray="4 6"
              />
              <XAxis
                type="number"
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9299a6", fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="referrer"
                width={96}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#c5cad3", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111821",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  color: "#f4f4f5",
                }}
                itemStyle={{ color: "#c4b5fd" }}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar
                dataKey="count"
                name="Visitors"
                fill="url(#referrerBarGradient)"
                radius={[0, 8, 8, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}