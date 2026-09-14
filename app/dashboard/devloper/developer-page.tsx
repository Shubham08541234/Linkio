"use client";

import { useEffect, useState } from "react";
import {
  Copy,
  KeyRound,
  Plus,
  Trash2,
  Check,
  BookOpen,
  Code2,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import EmptyState from "./empty-state";
import ApiKeyRow from "./apiKeyRow";
import ApiQuickStart from "./apiQuickStart";
import CreateKeyDialog from "./createKeyDialog";
import ApiKeyCreatedDialog from "./apiKeyCreatedDialog";


type ApiKey = {
  id: number;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  createdAt: string;
  revokedAt: string | null;
};

// devloper page

export default function DeveloperPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [creating, setCreating] = useState(false);

  async function fetchKeys() {
    try {
      setLoading(true);

      const response = await fetch("/api/v1/api-keys");

      if (!response.ok) {
        throw new Error("Failed to fetch API keys");
      }

      const data = await response.json();

      if (data.success) {
        setKeys(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchKeys();
  }, []);

  async function createApiKey() {
    try {
      setCreating(true);

      const response = await fetch("/api/v1/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newKeyName.trim() || "Default API Key",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create API key");
      }

      setCreatedKey(data.data.key);
      setNewKeyName("");

      await fetchKeys();
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create API key"
      );
    } finally {
      setCreating(false);
    }
  }

  async function revokeApiKey(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to revoke this API key? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/v1/api-keys/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to revoke API key");
      }

      await fetchKeys();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to revoke API key"
      );
    }
  }

  async function copyKey() {
    if (!createdKey) return;

    await navigator.clipboard.writeText(createdKey);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6" />

            <h1 className="text-2xl font-semibold">
              Developer
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage API keys and integrate Linkio with your applications.
          </p>
        </div>

        <Button
          onClick={() => {
            setShowCreate(true);
            setCreatedKey(null);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create API key
        </Button>
      </div>

      {/* API Keys */}
      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            API Keys
          </h2>

          <p className="text-sm text-muted-foreground">
            API keys allow external applications to access your Linkio
            account through the public API.
          </p>
        </div>

        <div className="rounded-xl border bg-card">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Loading API keys...
            </div>
          ) : keys.length === 0 ? (
            <EmptyState onCreate={() => setShowCreate(true)} />
          ) : (
            <div className="divide-y">
              {keys.map((key) => (
                <ApiKeyRow
                  key={key.id}
                  apiKey={key}
                  onRevoke={revokeApiKey}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Documentation */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              API Documentation
            </h2>

            <p className="text-sm text-muted-foreground">
              Learn how to integrate Linkio into your application.
            </p>
          </div>

          <Button variant="outline">
            <BookOpen className="mr-2 h-4 w-4" />
            Documentation
          </Button>
        </div>

        <ApiQuickStart />
      </section>

      {/* Create dialog */}
      {showCreate && (
        <CreateKeyDialog
          name={newKeyName}
          setName={setNewKeyName}
          creating={creating}
          onClose={() => {
            if (!creating) {
              setShowCreate(false);
            }
          }}
          onCreate={createApiKey}
        />
      )}

      {/* Newly created key */}
      {createdKey && (
        <ApiKeyCreatedDialog
          apiKey={createdKey}
          copied={copied}
          onCopy={copyKey}
          onClose={() => setCreatedKey(null)}
        />
      )}
    </div>
  );
}









