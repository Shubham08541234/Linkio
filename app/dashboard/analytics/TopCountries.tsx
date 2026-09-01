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
    <div className="rounded-lg border border-border p-6 mt-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Top Countries
        </h2>

        <p className="text-sm text-muted-foreground">
          Countries where your link was accessed
        </p>
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No country data available
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
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                type="number"
                allowDecimals={false}
              />

              <YAxis
                type="category"
                dataKey="country"
                width={80}
              />

              <Tooltip />

              <Bar
                dataKey="count"
                name="Clicks"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}