"use client";

import { useEffect, useState } from "react";
import UserPageTabBar from "./_components/UserPageTabBar";
import UserAnalysisPage from "./_pages/_analysis/UserAnalysisPage";
import UserHistoryPage from "./_pages/_history/UserHistoryPage";
import UserRepositoryPage from "./_pages/_repository/UserRepositoryPage";
import UserOverviewPage from "./_pages/_overview/UserOverviewPage";
import userStore from "@/store/user";
import repositoryStore from "./../../../store/repos";

export default function UserPage({ params }: { params: { id: string } }) {
  const [tabIndex, setTabIndex] = useState(0);
  const userName = userStore((state) => state.githubUserName);
  const setRepos = repositoryStore((state) => state.setRepos);
  useEffect(() => {
    // console.log("userName");
    // console.log(userName);
    if (userName !== null) {
      setRepos(userName);
    }
  }, [userName, setRepos]);
  //     const setRepos1 = repositoryStore((state) => state.setRepos1);
  // useEffect(() => {
  //   setRepos1(params.id);
  // }, []);
  //탭에 따른 랜더링될 페이지
  const renderTabContent = () => {
    switch (tabIndex) {
      case 0:
        return <UserOverviewPage uuid={params.id} />;
      case 1:
        return <UserHistoryPage />;
      case 2:
        return <UserRepositoryPage />;
      case 3:
        return <UserAnalysisPage uuid={params.id} />;
      default:
        return <UserOverviewPage uuid={params.id} />;
    }
  };

  const onClickTap = (idx: number) => {
    setTabIndex(idx);
  };
  return (
    <>
      <UserPageTabBar onClickTap={onClickTap} tabIndex={tabIndex} />
      {renderTabContent()}
    </>
  );
}
