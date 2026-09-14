import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

export default function ApiKeyCreatedDialog({
  apiKey,
  copied,
  onCopy,
  onClose,
}: {
  apiKey: string;
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-xl border bg-background p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
            <Check className="h-5 w-5 text-green-600" />
          </div>

          <div>
            <h2 className="font-semibold">
              API key created
            </h2>

            <p className="text-sm text-muted-foreground">
              Copy it now. You won't be able to see it again.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-3">
            <code className="min-w-0 flex-1 break-all text-sm">
              {apiKey}
            </code>

            <Button
              size="sm"
              variant="outline"
              onClick={onCopy}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3 text-sm">
          <strong>Important:</strong> Store this key securely.
          Never commit it to Git or expose it in frontend code.
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
