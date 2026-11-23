"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DeviceData {
  deviceType: string;
  count: number;
}

interface DeviceDistributionProps {
  urlId: number;
}

const COLORS = ["#a3e635", "#38bdf8", "#fbbf24", "#c084fc"];

export default function DeviceDistribution({
  urlId,
}: DeviceDistributionProps) {
  const [data, setData] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeviceStats() {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/analytics/devices?urlId=${urlId}`
        );

        const result = await response.json();

        setData(
          result.map((item: DeviceData) => ({
            ...item,
            count: Number(item.count),
          }))
        );
      } catch (error) {
        console.error("Failed to fetch device stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDeviceStats();
  }, [urlId]);

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <section className="rounded-3xl border border-border bg-card/60 p-5 shadow-xl shadow-black/10 sm:p-6">
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-300">
          Audience
        </p>
        <h2 className="text-lg font-semibold tracking-tight">Device types</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Devices used to access your link
        </p>
      </div>

      {loading ? (
        <div className="flex h-[290px] items-center justify-center">
          <div className="h-40 w-40 animate-pulse rounded-full border-[22px] border-muted/70" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-[290px] items-center justify-center rounded-2xl border border-dashed border-border bg-background/30 text-sm text-muted-foreground">
          No device data available
        </div>
      ) : (
        <div className="relative h-[290px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="deviceType"
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
                    key={entry.deviceType}
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