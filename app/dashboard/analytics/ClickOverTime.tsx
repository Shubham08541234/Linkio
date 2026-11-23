"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Activity, MousePointer2, Users } from "lucide-react";

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
  const totalClicks = data.reduce(
    (total, item) => total + Number(item.clicks),
    0,
  );
  const totalVisitors = data.reduce(
    (total, item) => total + Number(item.uniqueVisitors),
    0,
  );

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card/60 p-5 shadow-xl shadow-black/10 sm:p-7">
      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            <Activity className="h-4 w-4" />
            Engagement
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Click activity
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Daily clicks and unique visitors over time
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          aria-label="Select analytics date range"
          className="h-10 rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/50 px-4 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MousePointer2 className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Clicks in period</p>
            <p className="text-lg font-semibold tracking-tight">
              {totalClicks.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/50 px-4 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
            <Users className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">
              Daily unique visits
            </p>
            <p className="text-lg font-semibold tracking-tight">
              {totalVisitors.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[320px] items-end gap-3 rounded-2xl bg-background/30 p-6">
          {[42, 68, 50, 82, 57, 91, 64, 76, 48, 72, 55, 86].map(
            (height, index) => (
              <div
                key={index}
                className="flex-1 animate-pulse rounded-t-lg bg-muted/70"
                style={{ height: `${height}%` }}
              />
            ),
          )}
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-border bg-background/30 text-sm text-muted-foreground">
          No click data available for this period
        </div>
      ) : (
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="clicksGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#a3e635" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#a3e635" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="visitorsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="rgba(255,255,255,0.07)"
                vertical={false}
                strokeDasharray="4 6"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9299a6", fontSize: 12 }}
                tickMargin={12}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9299a6", fontSize: 12 }}
                tickMargin={8}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111821",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  color: "#f4f4f5",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
                }}
                itemStyle={{ color: "#f4f4f5" }}
                labelStyle={{ color: "#a1a1aa", marginBottom: 4 }}
                cursor={{
                  stroke: "rgba(255,255,255,0.22)",
                  strokeDasharray: "4 4",
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  paddingBottom: 18,
                  fontSize: 12,
                  color: "#a1a1aa",
                }}
              />
              <Area
                type="monotone"
                dataKey="clicks"
                name="Clicks"
                stroke="#a3e635"
                strokeWidth={3}
                fill="url(#clicksGradient)"
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="uniqueVisitors"
                name="Unique visitors"
                stroke="#38bdf8"
                strokeWidth={2.5}
                fill="url(#visitorsGradient)"
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
