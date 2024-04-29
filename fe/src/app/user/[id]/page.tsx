"use client";

import { useEffect, useState } from "react";
import UserPageTabBar from "./_components/UserPageTabBar";
import UserAnalysisPage from "./_pages/UserAnalysisPage";
import UserHistoryPage from "./_pages/UserHistoryPage";
import UserRepositoryPage from "./_pages/UserRepositoryPage";
import UserOverviewPage from "./_pages/UserOverviewPage";
import userStore from "@/store/user";
import repositoryStore from "./../../../store/repos";

export default function UserPage({ params }: { params: { id: string } }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [text, setText] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  const userName = userStore((state) => state.userName);
  const setUserName = userStore((state) => state.setUserName);
  const setRepos = repositoryStore((state) => state.setRepos);

  useEffect(() => {
    setRepos(userName);
  }, [userName, setRepos]);

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
      <div className="p-4 bg-appGrey1 flex">
        <input onChange={onChange} value={text} />
        <button
          className="p-2 bg-appGrey2"
          onClick={() => {
            setUserName(text);
          }}
        >
          유저 이름 변경
        </button>
      </div>
      <UserPageTabBar onClickTap={onClickTap} tabIndex={tabIndex} />
      {/* <h1>User Page ID: {params.id}</h1> */}
      {renderTabContent()}
    </>
  );
}
