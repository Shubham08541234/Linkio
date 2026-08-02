"use client";

import { Copy, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Url {
  id: number;
  shortCode: string;
  originalUrl: string;
  title?: string;
  clicks: number;
  createdAt: Date;
}

export default function UrlTable({
  urls,
  onDelete,
  onCopy,
}: {
  urls: Url[];
  onDelete: (id: number) => void;
  onCopy: (shortCode: string) => void;
}) {
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date(date));
  };

  const getShortUrl = (shortCode: string) => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/api/redirect/${shortCode}`;
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full">
        <thead className="bg-card/50 border-b border-border">
          <tr>
            <th className="text-left px-6 py-3 font-semibold text-foreground">
              Short Link
            </th>
            <th className="text-left px-6 py-3 font-semibold text-foreground">
              Title
            </th>
            <th className="text-left px-6 py-3 font-semibold text-foreground">
              Clicks
            </th>
            <th className="text-left px-6 py-3 font-semibold text-foreground">
              Created
            </th>
            <th className="text-right px-6 py-3 font-semibold text-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr
              key={url.id}
              className="border-b border-border hover:bg-card/30 transition"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono bg-card/50 px-3 py-1 rounded text-primary">
                    {url.shortCode}
                  </code>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="truncate max-w-xs">
                  <p className="text-foreground font-medium">
                    {url.title || "Untitled"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {url.originalUrl}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-foreground font-semibold">
                  {url.clicks}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-muted-foreground">
                  {formatDate(url.createdAt)}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onCopy(url.shortCode)}
                    title="Copy link"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(getShortUrl(url.shortCode))}
                    title="Open link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(url.id)}
                    className="text-destructive hover:text-destructive"
                    title="Delete link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
