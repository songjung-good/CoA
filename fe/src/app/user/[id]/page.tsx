"use client";

import { useState } from "react";
import UserPageTabBar from "./_components/UserPageTabBar";

export default function UserPage({ params }: { params: { id: string } }) {
  const [tabIndex, setTabIndex] = useState(0);

  const renderTabContent = () => {
    switch (tabIndex) {
      case 0:
        return <h1>개요 내용</h1>;
      case 1:
        return <h1>연혁 내용</h1>;
      case 2:
        return <h1>레포 내용</h1>;
      case 3:
        return <h1>심층분석 내용</h1>;
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
