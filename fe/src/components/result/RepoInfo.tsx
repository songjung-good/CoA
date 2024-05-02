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
w-2/3 min-h-60 flex justify-center shadow-lg bg-white rounded-2xl
`;
