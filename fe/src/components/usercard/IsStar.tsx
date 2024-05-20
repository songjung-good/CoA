"use client";

import UseAxios from "@/api/common/useAxios";
import { ApiResponse } from "@/api/userPage/apiContributions";
import StartIcon from "@/icons/StarIcon";
import StartIconFilled from "@/icons/StarIconFilled";
import { useState } from "react";

export default function IsStar({
  isBookmark,
  Uuid,
}: {
  isBookmark: boolean;
  Uuid: string;
}) {
  const [starState, setStartState] = useState(isBookmark);

  const postFollowData = async () => {
    try {
      const postResponse = await UseAxios().post(
        `/api/member/bookmarks/${Uuid}`,
      );
      // console.log(postResponse.data.result["currentStatus"]);
      return postResponse.data.result["currentStatus"];
    } catch (error) {
      console.error("'팔로우 post'요청 에러", error);
      return starState;
    }
  };
  const changeStar = async () => {
    // setStartState(!starState);
    //팔로우 변경시, post 요청 추가하기
    const response = await postFollowData();
    setStartState(response);
  };

  return (
    <button aria-label="팔로우 하기" onClick={changeStar} className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all">
      {starState ? <StartIconFilled /> : <StartIcon />}
    </button>
  );
}
