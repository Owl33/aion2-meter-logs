/**
 * app/rankings/page.tsx
 */

import rankingsData from "@/data/rankings.json";
import RankingsPage from "@/components/rankings/RankingsPage";
import { Suspense } from "react";

export default function Page() {
  return (

    <Suspense>

    <RankingsPage data={rankingsData} />;
  </Suspense>
  )
}
