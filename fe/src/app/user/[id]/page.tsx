"use client";

import { useState } from "react";
import UserPageTabBar from "./_components/UserPageTabBar";
import UserAnalysisPage from "./_pages/UserAnalysisPage";
import UserHistoryPage from "./_pages/UserHistoryPage";
import UserRepositoryPage from "./_pages/UserRepositoryPage";
import UserOverviewPage from "./_pages/UserOverviewPage";

export default function UserPage({ params }: { params: { id: string } }) {
  const [tabIndex, setTabIndex] = useState(0);

  const renderTabContent = () => {
    switch (tabIndex) {
      case 0:
        return <UserOverviewPage />;
      case 1:
        return <UserHistoryPage />;
      case 2:
        return <UserRepositoryPage />;
      case 3:
        return <UserAnalysisPage />;
      default:
        return null;
    }
  };

  const onClickTap = (idx: number) => {
    setTabIndex(idx);
  };
  return (
    <>
      <UserPageTabBar onClickTap={onClickTap} />
      <h1>User Page ID: {params.id}</h1>
      {renderTabContent()}
    </>
  );
}
