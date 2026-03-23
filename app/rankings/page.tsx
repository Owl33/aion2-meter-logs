/**
 * app/rankings/page.tsx
 */

import rankingsData from "@/data/rankings.json";
import RankingsPage from "@/components/rankings/RankingsPage";

export default function Page() {
  return <RankingsPage data={rankingsData} />;
}
