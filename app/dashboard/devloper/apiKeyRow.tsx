import { Button } from "@/components/ui/button";
import { KeyRound, Trash2 } from "lucide-react";

type ApiKey = {
  id: number;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  createdAt: string;
  revokedAt: string | null;
};



export default function ApiKeyRow({
  apiKey,
  onRevoke,
}: {
  apiKey: ApiKey;
  onRevoke: (id: number) => void;
}) {
  const revoked = Boolean(apiKey.revokedAt);

  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted/50">
          <KeyRound className="h-5 w-5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">
              {apiKey.name}
            </h3>

            {revoked ? (
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                Revoked
              </span>
            ) : (
              <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-600">
                Active
              </span>
            )}
          </div>

          <div className="mt-1 font-mono text-sm text-muted-foreground">
            {apiKey.keyPrefix}••••••••••••
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>
              Created{" "}
              {new Date(apiKey.createdAt).toLocaleDateString()}
            </span>

            {apiKey.lastUsedAt && (
              <span>
                Last used{" "}
                {new Date(apiKey.lastUsedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {!revoked && (
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => onRevoke(apiKey.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Revoke
        </Button>
      )}
    </div>
  );
}
