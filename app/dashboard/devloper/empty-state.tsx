import { Button } from "@/components/ui/button";
import { KeyRound, Plus } from "lucide-react";



export default function EmptyState({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-muted/50">
        <KeyRound className="h-6 w-6 text-muted-foreground" />
      </div>

      <h3 className="mt-4 font-medium">
        No API keys yet
      </h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Create an API key to start integrating Linkio with your
        applications.
      </p>

      <Button className="mt-5" onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Create API key
      </Button>
    </div>
  );
}
