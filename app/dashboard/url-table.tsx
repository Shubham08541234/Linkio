"use client";

import { Copy, Trash2, ExternalLink, QrCode, ChartNoAxesCombined } from "lucide-react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Dialog } from "@base-ui/react/dialog";

import { useRouter } from "next/navigation";

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

  const router = useRouter();
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
          {urls.map((url) => {
            const shortUrl = getShortUrl(url.shortCode);

            return (
              <tr
                key={url.id}
                className="border-b border-border hover:bg-card/30 transition"
              >
                <td className="px-6 py-4">
                  <code className="text-sm font-mono bg-card/50 px-3 py-1 rounded text-primary">
                    {url.shortCode}
                  </code>
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
                    {/* Copy */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onCopy(url.shortCode)}
                      title="Copy link"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>

                    {/* Open */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(shortUrl, "_blank")}
                      title="Open link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>

                    {/* QR Code */}
                    <Dialog.Root>
                      <Dialog.Trigger
                        render={
                          <Button size="sm" variant="ghost" title="QR Code" />
                        }
                      >
                        <QrCode className="w-4 h-4" />
                      </Dialog.Trigger>

                      <Dialog.Portal>
                        <Dialog.Backdrop className="fixed inset-0 bg-black/50" />

                        <Dialog.Popup className="fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background p-6 shadow-lg">
                          <Dialog.Title className="text-lg font-semibold text-center">
                            QR Code
                          </Dialog.Title>

                          <Dialog.Description className="mt-1 text-sm text-muted-foreground text-center">
                            Scan this QR code to open your shortened URL.
                          </Dialog.Description>

                          <div className="flex flex-col items-center gap-5 py-6">
                            {/* QR */}
                            <div className="bg-white p-4 rounded-lg">
                              <QRCode value={shortUrl} size={220} />
                            </div>

                            {/* URL */}
                            <div className="text-center break-all">
                              <p className="text-sm font-medium text-foreground">
                                {shortUrl}
                              </p>

                              <p className="text-xs text-muted-foreground mt-1">
                                Scan with your phone camera
                              </p>
                            </div>

                            {/* Copy */}
                            <Button
                              className="w-full"
                              onClick={() => onCopy(url.shortCode)}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Short URL
                            </Button>
                          </div>

                          <Dialog.Close
                            render={
                              <Button variant="outline" className="w-full" />
                            }
                          >
                            Close
                          </Dialog.Close>
                        </Dialog.Popup>
                      </Dialog.Portal>
                    </Dialog.Root>

                    {/* Analytics */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => router.push(`/dashboard/analytics/${url.id}`)}
                      title="View analytics"
                    >
                      <ChartNoAxesCombined className="w-4 h-4" />
                    </Button>

                    {/* Delete */}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
