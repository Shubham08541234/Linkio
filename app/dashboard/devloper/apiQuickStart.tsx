import { Code2, KeyRound } from "lucide-react";

export default function ApiQuickStart() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border p-5">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4" />

          <h3 className="font-medium">
            Authentication
          </h3>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Include your API key in the Authorization header of
          every request.
        </p>

        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 text-xs">
{`Authorization: Bearer lk_live_xxxxxxxxx`}
        </pre>
      </div>

      <div className="rounded-xl border p-5">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4" />

          <h3 className="font-medium">
            Create a short URL
          </h3>
        </div>

        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 text-xs">
{`curl -X POST \\
  https://linkio.com/api/v1/urls \\
  -H "Authorization: Bearer lk_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com"
  }'`}
        </pre>
      </div>
    </div>
  );
}