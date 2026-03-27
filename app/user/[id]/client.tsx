"use client"

// app/user/[id]/client.tsx

import { useState } from "react"
import UserProfileCard from "./components/UserProfileCard"
import DungeonStatGrid from "./components/DungeonStatGrid"
import RecentLogsTable from "./components/RecentLogsTable"
import type { UserProfileData } from "./types"
import AppTabs from "@/components/shared/AppTabs"
import TransitionContent from "@/components/shared/TransitionContent"

interface UserClientProps {
  profile: UserProfileData
}

export default function UserClient({ profile }: UserClientProps) {
  const [contentTab, setContentTab] = useState("dungeons")
  const tabs = [
    { value: "dungeons", label: "던전 기록" },
    { value: "logs", label: "최근 로그" },
  ]
  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-5 px-5 py-6 pb-16">
      <UserProfileCard profile={profile} />

      <AppTabs tabs={tabs} active={contentTab} onChange={setContentTab} />
      <TransitionContent key={contentTab}>
        {contentTab == "dungeons" && (
          <DungeonStatGrid dungeonStats={profile.dungeonStats} />
        )}
        {contentTab == "logs" && <RecentLogsTable logs={profile.recentLogs} />}
      </TransitionContent>

      {/* <AppTabs defaultValue="dungeons">
        <AppTabsList>
          <AppTabsTrigger value="dungeons">던전 기록</AppTabsTrigger>
          <AppTabsTrigger value="logs">최근 로그</AppTabsTrigger>
        </AppTabsList>

        <AppTabsContent value="dungeons" className="mt-4">
        </AppTabsContent>

        <AppTabsContent value="logs" className="mt-4">
        </AppTabsContent>
      </AppTabs> */}
    </div>
  )
}
