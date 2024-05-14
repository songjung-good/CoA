"use client";

import Image from "next/image";
import userStore from "@/store/user";
import EditIconDark from "@/icons/EditIconDark";
import UseAxios from "@/api/common/useAxios";
import { useEffect, useState } from "react";
import { colorMapping } from "@/components/colorMap";
import useCommonCodeStore from "@/store/commoncode";

interface Skill {
  codeId: number;
  codeName: string;
}

interface Member {
  memberUuid: string;
  memberNickName: string;
  memberImg: string;
  memberIntro: string;
  skillList: Skill[];
  memberJobCodeId: number;
  isMine: boolean;
  isBookmark: boolean;
}

interface ApiResponse {
  result: Member;
}

export default function UserProfile() {
  const axios = UseAxios();
  const { response } = useCommonCodeStore.getState();
  const [userUuid, setUserUuid] = useState("");
  const [userCard, setUserCard] = useState<Member>({
    memberUuid: "",
    memberNickName: "",
    memberImg: "",
    memberIntro: "",
    skillList: [],
    memberJobCodeId: 0,
    isMine: true,
    isBookmark: true,
  });

  // 첫 번째 useEffect: userInfo를 가져오는 요청
  useEffect(() => {
    axios
      .get(`/api/member`)
      .then((res) => {
        setUserUuid(res.data.result.memberUuid);
      })
      .catch((error) => {
        console.error("Failed to fetch user info:", error);
      });
  }, []);

  // 두 번째 useEffect: userInfo.memberUuid가 변경될 때 userCard를 가져오는 요청
  useEffect(() => {
    if (userUuid) {
      axios
        .get(`/api/member/${userUuid}`)
        .then((res) => {
          console.log(res.data.result);
          setUserCard(res.data.result);
        })
        .catch((error) => {
          console.error("Failed to fetch user card:", error);
        });
    }
  }, [userUuid]);

  return (
    <div className="w-full sm:w-1/3 h-full border border-black flex flex-col">
      <div className="flex justify-between w-full h-1/3">
        <img
          src={userCard?.memberImg || `/image/LoadingSpinner.gif`}
          alt="member image"
          className="rounded-full w-1/6 h-1/6"
        />
        <div className="flex w-full justify-center items-center">
          <p className="text-base sm:text-base">{userCard.memberNickName}</p>
        </div>
      </div>
      <div className="h-full">
        <div className="flex">
          <p></p>
        </div>
      </div>
    </div>
  );
}
