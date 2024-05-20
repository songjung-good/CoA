"use client";

import { useEffect, useState } from "react";
import UserPageTabBar from "./_components/UserPageTabBar";
import UserAnalysisPage from "./_pages/_analysis/UserAnalysisPage";
import UserHistoryPage from "./_pages/_history/UserHistoryPage";
import UserRepositoryPage from "./_pages/_repository/UserRepositoryPage";
import UserOverviewPage from "./_pages/_overview/UserOverviewPage";
import repositoryStore from "./../../../store/repos";
import calendarStore from "@/store/calendar";

export default function UserPage({ params }: { params: { id: string } }) {
  const [tabIndex, setTabIndex] = useState(0);
  const { fetchData1, setCategory } = calendarStore();
  const setRepos1 = repositoryStore((state) => state.setRepos1);
  const fetchData = async () => {
    setCategory(3);
    await fetchData1(params.id);
  };
  useEffect(() => {
    setRepos1(params.id);
    fetchData();
  }, []);
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
        return <UserAnalysisPage uuid={params.id} />;
      default:
        return <UserOverviewPage />;
    }
  };

  const onClickTap = (idx: number) => {
    setTabIndex(idx);
  };
  return (
    <>
      <UserPageTabBar
        onClickTap={onClickTap}
        tabIndex={tabIndex}
        uuid={params.id}
      />
      {renderTabContent()}
    </>
  );
}
