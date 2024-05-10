"use client";

import { useEffect, useState } from "react";
import UseAxios from "@/api/common/useAxios";

interface Skill {
  codeId: number;
  codeName: string;
}

interface Member {
  memberId: number;
  memberNickName: string;
  memberImg: string;
  memberIntro: string;
  skillList: Skill[];
}

interface ApiResponse {
  result: Member[];
}

const dummyData: Member[] = [
  {
    memberId: 1,
    memberNickName: "노마드 코더",
    memberImg:
      "https://yt3.googleusercontent.com/ytc/AIdro_kZGbEvWmB_2CZMcZVcCpjFsiQNVQZEehF8jinP6zlFJ7s=s176-c-k-c0x00ffffff-no-rj",
    memberIntro: `한국인 린과 콜롬비아인 니꼴라스의 프로젝트 "노마드 코더" 입니다.`,
    skillList: [
      { codeId: 1, codeName: "JavaScript" },
      { codeId: 2, codeName: "React" },
    ],
  },
  {
    memberId: 2,
    memberNickName: "개발바닥",
    memberImg:
      "https://yt3.googleusercontent.com/ytc/AIdro_mDWXwLF9kj8Hzm_nh3ZDVo0LAzH-DzXyaFa8odzPeBTw=s176-c-k-c0x00ffffff-no-rj",
    memberIntro: `본격 세계최초 DEV 엔터테인먼트 토크쇼`,
    skillList: [
      { codeId: 3, codeName: "Python" },
      { codeId: 4, codeName: "Django" },
    ],
  },
];

export default function FollowList() {
  const [data, setData] = useState<Member[]>([]);
  const fetchFollowData = async () => {
    try {
      const response = await UseAxios().get<ApiResponse>(
        "/api/member/bookmarks",
      );
      setData(response.data.result);
      //더미데이터 사용 임시
      setData(dummyData);
    } catch (error) {
      console.error("'/api/member/bookmarks'요청 에러", error);
    }
  };
  useEffect(() => {
    fetchFollowData();
  }, []);

  return (
    <ul className="flex flex-col gap-4">
      {data.map((member) => (
        <li key={member.memberId} className="card">
          <div className="flex">
            <img src={member.memberImg} alt={member.memberNickName} />
            <div>
              <h2>{member.memberNickName}</h2>
              <p>{member.memberIntro}</p>
              <ul>
                {member.skillList.map((skill) => (
                  <li key={skill.codeId}>{skill.codeName}</li>
                ))}
              </ul>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
