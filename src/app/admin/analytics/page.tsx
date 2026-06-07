import { getAnalyticsData } from "@/lib/actions/admin";
import { AnalyticsCharts } from "./analytics-charts";

export const metadata = { title: "Analytics" };

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>
      <AnalyticsCharts data={data} />
    </div>
  );
}
