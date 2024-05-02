"use client";

import StartIcon from "@/icons/StarIcon";
import StartIconFilled from "@/icons/StarIconFilled";
import { useState } from "react";

export default function IsStar() {
  const [starState, setStartState] = useState(false);

  const changeStar = () => {
    setStartState(!starState);
    //팔로우 변경시, post 요청 추가하기
  };

  return (
    <button onClick={changeStar} className="w-6 h-6">
      {starState ? <StartIconFilled /> : <StartIcon />}
    </button>
  );
}
