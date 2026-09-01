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

const COLORS = [
  "#60a5fa",
  "#34d399",
  "#fbbf24",
  "#f87171",
];

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

  return (
    <div className="rounded-lg border border-border p-6 mt-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Device Distribution
        </h2>

        <p className="text-sm text-muted-foreground">
          Devices used to access your link
        </p>
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No device data available
        </div>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="deviceType"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.deviceType}
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