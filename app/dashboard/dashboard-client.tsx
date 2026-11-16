"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createUrl, deleteUrl } from "@/app/actions/urls";
import {
  Plus,
  LogOut,
  CheckCircle2,
  XCircle,
  MailWarning,
  Link2,
  Code2,
  MousePointerClick,
  Search,
  ArrowUpRight,
  ChartNoAxesCombined,
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
  customAlias?: string | null;
  title?: string | null;
  clicks: number;
  createdAt: Date;
}

interface User {
  name: string | null;
  email: string;
  emailVerified: boolean;
}

interface DashboardStats {
  totalLinks: number;
  totalClicks: number;
}

export default function DashboardClient({
  initialUrls,
  stats,
  user,
}: {
  initialUrls: Url[];
  stats: DashboardStats;
  user: User;
}) {
  const router = useRouter();
  const [urls, setUrls] = useState<Url[]>(initialUrls);
  const [dashboardStats, setDashboardStats] = useState(stats);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");

  const initial =
    user.name?.charAt(0).toUpperCase() ?? user.email.charAt(0).toUpperCase();

  const query = search.trim().toLowerCase();
  const visibleUrls = urls
    .filter((url) =>
      [url.title ?? "", url.originalUrl, url.shortCode].some((value) =>
        value.toLowerCase().includes(query),
      ),
    )
    .sort((a, b) =>
      sortBy === "popular"
        ? b.clicks - a.clicks
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  const averageClicks =
    dashboardStats.totalLinks > 0
      ? Math.round(dashboardStats.totalClicks / dashboardStats.totalLinks)
      : 0;

  const handleCreateUrl = async (data: any) => {
    try {
      setIsLoading(true);
      const newUrl = await createUrl(data);
      setUrls((currentUrls) => [newUrl, ...currentUrls]);
      setDashboardStats((currentStats) => ({
        totalLinks: currentStats.totalLinks + 1,
        totalClicks: currentStats.totalClicks + newUrl.clicks,
      }));
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
      const deletedUrl = urls.find((url) => url.id === id);
      setUrls((currentUrls) => currentUrls.filter((url) => url.id !== id));
      if (deletedUrl) {
        setDashboardStats((currentStats) => ({
          totalLinks: Math.max(0, currentStats.totalLinks - 1),
          totalClicks: Math.max(0, currentStats.totalClicks - deletedUrl.clicks),
        }));
      }
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
    if (res.error) {
      console.log(res.error);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card/30 px-5 py-6 lg:flex">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-2xl font-bold tracking-tight"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Link2 className="h-5 w-5" />
          </span>
          <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            Linkio
          </span>
        </Link>

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Workspace
        </p>
        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary"
            aria-current="page"
          >
            <Link2 className="h-4 w-4" />
            Links
          </Link>
          <Link
            href="/dashboard/devloper"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted/60 hover:text-foreground"
          >
            <Code2 className="h-4 w-4" />
            Developer API
          </Link>
        </nav>

        <div className="mt-auto rounded-2xl border border-border bg-background/70 p-4">
          <p className="text-sm font-semibold">Your links, at a glance</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Create short links and follow their performance from one place.
          </p>
          <Button
            className="mt-4 w-full"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create a link
          </Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-bold tracking-tight lg:hidden"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Link2 className="h-4 w-4" />
              </span>
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Linkio
              </span>
            </Link>
            <div className="hidden text-sm text-muted-foreground lg:block">
              Workspace <span className="mx-2 text-border">/</span>{" "}
              <span className="text-foreground">Links</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="hidden sm:inline-flex"
              >
                <Plus className="h-4 w-4" /> New link
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                      aria-label="Open account menu"
                    />
                  }
                >
                  {initial}
                </DropdownMenuTrigger>

                <DropdownMenuPortal>
                  <DropdownMenuContent align="end" className="z-50 w-64">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-medium text-foreground">
                            {user.name || user.email}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-xs text-muted-foreground">
                              {user.email}
                            </span>
                            {user.emailVerified ? (
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />
                            )}
                          </div>
                          <span
                            className={`mt-0.5 w-fit rounded-full px-1.5 py-0.5 text-[11px] font-medium ${
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
                          className="cursor-pointer gap-2"
                        >
                          <MailWarning className="h-4 w-4" />
                          Verify Email
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer gap-2 text-destructive focus:text-destructive"
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

        <nav className="flex gap-2 overflow-x-auto border-b border-border px-4 py-2.5 lg:hidden">
          <Link
            href="/dashboard"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
            aria-current="page"
          >
            <Link2 className="h-4 w-4" />
            Links
          </Link>
          <Link
            href="/dashboard/devloper"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted/60 hover:text-foreground"
          >
            <Code2 className="h-4 w-4" />
            Developer API
          </Link>
        </nav>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-primary">
                Link management
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Your links
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Create, organize, and track your shortened URLs.
              </p>
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="sm:hidden"
            >
              <Plus className="h-4 w-4" /> New link
            </Button>
          </div>

          <section
            aria-label="Link performance overview"
            className="mb-8 grid gap-4 sm:grid-cols-3"
          >
            <StatCard
              label="Total links"
              value={dashboardStats.totalLinks.toLocaleString()}
              detail="Active links in your workspace"
              icon={<Link2 className="h-5 w-5" />}
            />
            <StatCard
              label="Total clicks"
              value={dashboardStats.totalClicks.toLocaleString()}
              detail="Across all active links"
              icon={<MousePointerClick className="h-5 w-5" />}
            />
            <StatCard
              label="Average clicks"
              value={averageClicks.toLocaleString()}
              detail="Clicks per active link"
              icon={<ChartNoAxesCombined className="h-5 w-5" />}
            />
          </section>

          <section className="overflow-hidden rounded-2xl border border-border bg-card/30">
            <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div>
                <h2 className="font-semibold">Recent links</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Showing your latest {urls.length} links
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="relative block sm:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <span className="sr-only">Search recent links</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search recent links"
                    className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </label>
                <label>
                  <span className="sr-only">Sort links</span>
                  <select
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(
                        event.target.value === "popular" ? "popular" : "newest",
                      )
                    }
                    className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30 sm:w-40"
                  >
                    <option value="newest">Newest first</option>
                    <option value="popular">Most clicked</option>
                  </select>
                </label>
              </div>
            </div>

            {urls.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Link2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">No links yet</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                  Create your first short link and its click activity will show
                  up here.
                </p>
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  className="mt-5"
                >
                  <Plus className="h-4 w-4" /> Create your first link
                </Button>
              </div>
            ) : visibleUrls.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Search className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
                <h3 className="font-semibold">No matching links</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different title, URL, or short code.
                </p>
              </div>
            ) : (
              <UrlTable
                urls={visibleUrls}
                onDelete={handleDeleteUrl}
                onCopy={handleCopyLink}
              />
            )}
          </section>
          <p className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
            Need API access?{" "}
            <Link
              href="/dashboard/devloper"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              Visit Developer API <ArrowUpRight className="h-3 w-3" />
            </Link>
          </p>
        </main>
      </div>

      <CreateUrlDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateUrl}
        isLoading={isLoading}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5 transition-colors hover:bg-card/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
          <p className="mt-1.5 text-xs text-muted-foreground">{detail}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
      </div>
    </div>
  );
}
