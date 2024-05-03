import { useState, useEffect } from "react";
import tw from "tailwind-styled-components";

export default function RepoInfo() {
  return (
    <RepoInfoDiv>
      <p>레포 정보</p>
    </RepoInfoDiv>
  );
}

const RepoInfoDiv = tw.div`
w-full min-h-60 h-1/4 flex justify-center shadow-lg bg-white rounded-2xl
`;
