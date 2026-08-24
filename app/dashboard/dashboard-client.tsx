"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createUrl, getUrls, deleteUrl, updateUrl } from "@/app/actions/urls";
import {
  Plus,
  LogOut,
  Copy,
  Trash2,
  ExternalLink,
  Settings,
  CheckCircle2,
  XCircle,
  MailWarning,
} from "lucide-react";
import CreateUrlDialog from "./create-url-dialog";
import UrlTable from "./url-table";
import { authClient, signOut } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

interface Url {
  id: number;
  shortCode: string;
  originalUrl: string;
  customAlias?: string;
  title?: string;
  clicks: number;
  createdAt: Date;
}

interface User {
  name: string | null;
  email: string;
  emailVerified: boolean;
}

export default function DashboardClient({
  initialUrls,
  user,
}: {
  initialUrls: Url[];
  user: User;
}) {
  const router = useRouter();
  const [urls, setUrls] = useState<Url[]>(initialUrls);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initial =
    user.name?.charAt(0).toUpperCase() ?? user.email.charAt(0).toUpperCase();

  const handleCreateUrl = async (data: any) => {
    try {
      setIsLoading(true);
      const newUrl = await createUrl(data);
      setUrls([newUrl, ...urls]);
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Failed to create URL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUrl = async (id: number) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      await deleteUrl(id);
      setUrls(urls.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Failed to delete URL:", error);
    }
  };

  const handleCopyLink = (shortCode: string) => {
    const fullUrl = `${window.location.origin}/api/redirect/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const handleEmailVerification = async (email: string) => {
    const res = await authClient.sendVerificationEmail({
      email,
      callbackURL: "/",
    });
    console.log("res: ", res);
    if (res.error) {
      console.log(res.error);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text"
          >
            Linkio
          </Link>
          <div className="flex gap-4 items-center">
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" /> New Link
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer" />
                }
              >
                {initial}
              </DropdownMenuTrigger>

              <DropdownMenuPortal>
                <DropdownMenuContent align="end" className="w-64 z-50">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-medium text-foreground">
                          {user.name}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </span>
                          {user.emailVerified ? (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />
                          )}
                        </div>
                        <span
                          className={`text-[11px] font-medium w-fit px-1.5 py-0.5 rounded-full mt-0.5 ${
                            user.emailVerified
                              ? "bg-green-100 text-green-700"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {user.emailVerified ? "Verified" : "Not verified"}
                        </span>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {!user.emailVerified && (
                      <DropdownMenuItem
                        onClick={() => handleEmailVerification(user.email)}
                        className="gap-2 cursor-pointer"
                      >
                        <MailWarning className="h-4 w-4" />
                        Verify Email
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Links</h1>
          <p className="text-muted-foreground">
            Manage and track all your shortened URLs
          </p>
        </div>

        {urls.length === 0 ? (
          <div className="text-center py-12 rounded-lg border border-border bg-card/30">
            <h3 className="text-xl font-semibold mb-2">No links yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first short link to get started
            </p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" /> Create First Link
            </Button>
          </div>
        ) : (
          <UrlTable
            urls={urls}
            onDelete={handleDeleteUrl}
            onCopy={handleCopyLink}
          />
        )}
      </main>

      {/* Create URL Dialog */}
      <CreateUrlDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateUrl}
        isLoading={isLoading}
      />
    </div>
  );
}
