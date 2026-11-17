
"use client";

import { useState } from "react";

export default function PasswordForm({
  shortCode,
}: {
  shortCode: string;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shortCode, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Incorrect password");
        return;
      }

      window.location.href = data.redirectUrl;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        required
        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-white"
      />

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-white py-3 font-semibold text-black hover:bg-gray-200 disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Unlock Link"}
      </button>
    </form>
  );
}
