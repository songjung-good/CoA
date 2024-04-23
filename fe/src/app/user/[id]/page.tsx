"use client";

import { useState } from "react";
import UserPageTabBar from "./_components/UserPageTabBar";

export default function UserPage({ params }: { params: { id: string } }) {
  const [tabIndex, setTabIndex] = useState(0);
  const onClickTap = (idx: number) => {
    setTabIndex(idx);
  };
  return (
    <>
      <UserPageTabBar />
      <h1>User Page ID: {params.id}</h1>
      <h1>개요</h1>
    </>
  );
}
