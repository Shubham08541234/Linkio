import { Button } from "@/components/ui/button";




export default function CreateKeyDialog({
  name,
  setName,
  creating,
  onClose,
  onCreate,
}: {
  name: string;
  setName: (value: string) => void;
  creating: boolean;
  onClose: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-xl">
        <div>
          <h2 className="text-lg font-semibold">
            Create API key
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Give your API key a name so you can identify it later.
          </p>
        </div>

        <div className="mt-6">
          <label className="text-sm font-medium">
            Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My application"
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            autoFocus
          />
        </div>

        <div className="mt-6 rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
          <strong className="text-foreground">
            Keep your API key secret.
          </strong>{" "}
          Anyone with the key can access your Linkio API as you.
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={creating}
            className="cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            onClick={onCreate}
            disabled={creating}
            className="cursor-pointer"
          >
            {creating ? "Creating..." : "Create key"}
          </Button>
        </div>
      </div>
    </div>
  );
}
