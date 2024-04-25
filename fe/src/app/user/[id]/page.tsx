"use client";

import { useEffect, useState } from "react";
import UserPageTabBar from "./_components/UserPageTabBar";
import UserAnalysisPage from "./_pages/UserAnalysisPage";
import UserHistoryPage from "./_pages/UserHistoryPage";
import UserRepositoryPage from "./_pages/UserRepositoryPage";
import UserOverviewPage from "./_pages/UserOverviewPage";

export default function UserPage({ params }: { params: { id: string } }) {
  const [tabIndex, setTabIndex] = useState(0);

  //탭에 따른 랜더링될 페이지
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
        return <UserOverviewPage />;
    }
  };

  const onClickTap = (idx: number) => {
    setTabIndex(idx);
  };
  return (
    <>
      <UserPageTabBar onClickTap={onClickTap} tabIndex={tabIndex} />
      {/* <h1>User Page ID: {params.id}</h1> */}
      {renderTabContent()}
    </>
  );
}
