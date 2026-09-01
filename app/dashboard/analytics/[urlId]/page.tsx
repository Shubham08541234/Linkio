import { redirect } from "next/navigation";
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

  console.log("urlid: ", urlId);

  const urlid = Number(urlId);

  if (!urlid || Number.isNaN(urlid)) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <ClicksOverTime urlId={urlId} />

      <DeviceDistribution urlId={urlId} />

      <BrowserDistribution urlId={urlId} />

      <TopCountries urlId={urlId} />

      <TopReferrers urlId={urlId} />
    </div>
  );
}
