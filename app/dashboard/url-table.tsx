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
  title?: string | null;
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
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const router = useRouter();
  const getShortUrl = (shortCode: string) => {
    if (typeof window === "undefined") return "";

    return `${window.location.origin}/api/redirect/${shortCode}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px]">
        <thead className="border-b border-border bg-background/50">
          <tr>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Short Link
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Destination
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Clicks
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Created
            </th>

            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
                className="border-b border-border/70 transition-colors last:border-b-0 hover:bg-card/60"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ExternalLink className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-mono text-sm font-medium text-primary">
                        {url.shortCode}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {url.clicks.toLocaleString()}{" "}
                        {url.clicks === 1 ? "click" : "clicks"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="max-w-sm px-5 py-4">
                  <div className="max-w-sm">
                    <p className="truncate text-sm font-medium text-foreground">
                      {url.title || "Untitled link"}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {url.originalUrl}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex min-w-12 items-center justify-center rounded-full bg-muted/70 px-2.5 py-1 text-sm font-semibold tabular-nums">
                    {url.clicks.toLocaleString()}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(url.createdAt)}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    {/* Copy */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onCopy(url.shortCode)}
                      title="Copy link"
                      aria-label={`Copy short link ${url.shortCode}`}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>

                    {/* Open */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => window.open(shortUrl, "_blank")}
                      title="Open link"
                      aria-label={`Open short link ${url.shortCode}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>

                    {/* QR Code */}
                    <Dialog.Root>
                      <Dialog.Trigger
                        render={
                          <Button
                            size="icon"
                            variant="ghost"
                            title="QR Code"
                            aria-label={`Show QR code for ${url.shortCode}`}
                          />
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
                      size="icon"
                      variant="ghost"
                      onClick={() => router.push(`/dashboard/analytics/${url.id}`)}
                      title="View analytics"
                      aria-label={`View analytics for ${url.shortCode}`}
                    >
                      <ChartNoAxesCombined className="w-4 h-4" />
                    </Button>

                    {/* Delete */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDelete(url.id)}
                      className="text-destructive hover:text-destructive"
                      title="Delete link"
                      aria-label={`Delete short link ${url.shortCode}`}
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
