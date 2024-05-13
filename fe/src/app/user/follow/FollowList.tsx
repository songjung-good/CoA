"use client";

import { useEffect, useState } from "react";
import UseAxios from "@/api/common/useAxios";
import { colorMapping } from "../../../components/colorMap";
import IsStar from "@/components/usercard/IsStar";
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
  result: Member[];
}

const dummyData: Member[] = [
  {
    memberUuid: "노마드 코더",
    memberNickName: "노마드 코더",
    memberImg:
      "https://yt3.googleusercontent.com/ytc/AIdro_kZGbEvWmB_2CZMcZVcCpjFsiQNVQZEehF8jinP6zlFJ7s=s176-c-k-c0x00ffffff-no-rj",
    memberIntro: `한국인 린과 콜롬비아인 니꼴라스의 프로젝트 "노마드 코더" 입니다.`,
    skillList: [
      { codeId: 1, codeName: "JavaScript" },
      { codeId: 2, codeName: "React.js" },
    ],
    memberJobCodeId: 0,
    isMine: false,
    isBookmark: true,
  },
  {
    memberUuid: "개발바닥",
    memberNickName: "개발바닥",
    memberImg:
      "https://yt3.googleusercontent.com/ytc/AIdro_mDWXwLF9kj8Hzm_nh3ZDVo0LAzH-DzXyaFa8odzPeBTw=s176-c-k-c0x00ffffff-no-rj",
    memberIntro: `본격 세계최초 DEV 엔터테인먼트 토크쇼`,
    skillList: [
      { codeId: 3, codeName: "Python" },
      { codeId: 4, codeName: "Django" },
    ],
    memberJobCodeId: 0,
    isMine: false,
    isBookmark: true,
  },
];
const noFollowData = [
  {
    memberUuid: "no-follow-user",
    memberNickName: "팔로우한 유저가 없어요!",
    memberImg: "/image/logo200.png",
    memberIntro: `다른 유저를 팔로우 해보세요!`,
    skillList: [],
    memberJobCodeId: 0,
    isMine: false,
    isBookmark: true,
  },
];
export default function FollowList() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Member[]>([]);
  const { response } = useCommonCodeStore.getState();

  const fetchFollowData = async () => {
    try {
      const bookmarksResponse = await UseAxios().get<ApiResponse>(
        "/api/member/bookmarks",
      );
      // console.log(response.data);
      if (bookmarksResponse.data.result.length === 0) {
        setData(noFollowData);
      } else {
        setData(bookmarksResponse.data.result);
      }
      //더미데이터 사용 임시
      // setData(dummyData);
      setIsLoading(false);
    } catch (error) {
      console.error("'/api/member/bookmarks'요청 에러", error);
    }
  };

  useEffect(() => {
    fetchFollowData();
    console.log(response.result);
    console.log(response.result.commonCodeList[2].codes);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="w-full h-48 flex justify-center items-center text-4xl">
          Loading...
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {data.map((member) => (
            <li key={member.memberUuid} className="card flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                <div className="rounded-full overflow-hidden">
                  <img
                    src={member.memberImg}
                    alt={member.memberNickName}
                    style={{ width: "144px", height: "144px" }}
                  />
                </div>
                <div className="flex flex-col grow gap-2">
                  <div className="flex justify-between">
                    <p>{member.memberNickName}</p>
                    <div className="flex gap-2">
                      <p>
                        {
                          response.result.commonCodeList[2].codes![
                            `${member.memberJobCodeId}`
                          ]
                        }
                      </p>
                      <IsStar
                        isBookmark={member.isBookmark}
                        Uuid={member.memberUuid}
                      />
                    </div>
                  </div>
                  <div className="bg-appGrey1 p-4 rounded-2xl grow">
                    <p>{member.memberIntro}</p>
                  </div>
                </div>
              </div>
              <div className="skills-container">
                <ul className="flex gap-2 items-center">
                  <p>기술 스택 : </p>

                  {member.skillList.map((skill) => (
                    <li
                      key={skill.codeId}
                      style={{
                        padding: "4px",
                        backgroundColor: `${colorMapping[skill.codeName]}`,
                      }}
                    >
                      <p className="bg-white px-1">{skill.codeName}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
