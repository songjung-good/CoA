"use client";

import StartIcon from "@/icons/StarIcon";
import StartIconFilled from "@/icons/StarIconFilled";
import { useState } from "react";

interface IsStarProps {
  isStar: boolean;
}

export default function IsStar({
  isStar,
}: IsStarProps) {
  const [starState, setStartState] =
    useState(isStar);

  const changeStar = () => {
    setStartState(!starState);
    //팔로우 변경시, post 요청 추가하기
  };

  return (
    <button onClick={changeStar}>
      {starState ? (
        <StartIconFilled />
      ) : (
        <StartIcon />
      )}
    </button>
  );
}
