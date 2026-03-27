// app/rankings/page.tsx

import rankingsData from "@/data/rankings.json";
import RankingClient from "./client";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <RankingClient data={rankingsData} />
    </Suspense>
  );
}
