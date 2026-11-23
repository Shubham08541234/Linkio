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

interface CountryData {
  country: string;
  count: number;
}

interface TopCountriesProps {
  urlId: number;
}

export default function TopCountries({
  urlId,
}: TopCountriesProps) {
  const [data, setData] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCountryStats() {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/analytics/countries?urlId=${urlId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch country stats");
        }

        const result = await response.json();

        setData(
          result.map((item: CountryData) => ({
            ...item,
            count: Number(item.count),
          }))
        );
      } catch (error) {
        console.error(
          "Failed to fetch country stats:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCountryStats();
  }, [urlId]);

  return (
    <section className="rounded-3xl border border-border bg-card/60 p-5 shadow-xl shadow-black/10 sm:p-6">
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">
          Geography
        </p>
        <h2 className="text-lg font-semibold tracking-tight">Top countries</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Countries where your link was accessed
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
          No country data available
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
                  id="countryBarGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#fb7185" />
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
                dataKey="country"
                width={82}
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
                itemStyle={{ color: "#fbbf24" }}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar
                dataKey="count"
                name="Clicks"
                fill="url(#countryBarGradient)"
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