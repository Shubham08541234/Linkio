import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChartNoAxesCombined } from "lucide-react";
import ClicksOverTime from "../ClickOverTime";
import DeviceDistribution from "../DeviceDistribution";
import BrowserDistribution from "../BrowserDistribution";
import TopCountries from "../TopCountries";
import TopReferrers from "../TopReferrer";

export const dynamic = "force-dynamic";

export default async function Charts({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  const urlid = Number(urlId);

  if (!urlid || Number.isNaN(urlid)) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="relative overflow-hidden rounded-3xl border border-border bg-card/60 p-6 shadow-2xl shadow-black/10 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative">
            <Link
              href="/dashboard"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to links
            </Link>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                  <ChartNoAxesCombined className="h-4 w-4" />
                  Link performance
                </p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Analytics overview
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  See when people visit, what they use, and where they come
                  from.
                </p>
              </div>
              <span className="w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                Link #{urlid}
              </span>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          <ClicksOverTime urlId={urlid} />

          <section
            aria-label="Audience breakdown"
            className="grid gap-6 lg:grid-cols-2"
          >
            <DeviceDistribution urlId={urlid} />
            <BrowserDistribution urlId={urlid} />
          </section>

          <section
            aria-label="Traffic sources"
            className="grid gap-6 lg:grid-cols-2"
          >
            <TopCountries urlId={urlid} />
            <TopReferrers urlId={urlid} />
          </section>
        </div>
      </div>
    </main>
  );
}
