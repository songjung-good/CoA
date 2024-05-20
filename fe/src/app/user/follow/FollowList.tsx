"use client";

import React, { useEffect, useState } from "react";
import UseAxios from "@/api/common/useAxios";
import { colorMapping } from "../../../components/colorMap";
import IsStar from "@/components/usercard/IsStar";
import useCommonCodeStore from "@/store/commoncode";
import { useRouter } from "next/navigation";

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
  isSuccess: boolean;
  message: string;
  code: number;
  result: Member[];
}

const noFollowData = [
  {
    memberUuid: "no-follow-user",
    memberNickName: "팔로우한 유저가 없어요!",
    memberImg: "/image/logo200.webp",
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("서버 오류입니다.");
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const fetchFollowData = async () => {
    try {
      const bookmarksResponse = await UseAxios().get<ApiResponse>(
        "/api/member/bookmarks",
      );
      // console.log(bookmarksResponse);
      // console.log(bookmarksResponse.data.isSuccess);
      if (bookmarksResponse.data.isSuccess === true) {
        if (bookmarksResponse?.data.result.length === 0) {
          setData(noFollowData);
        } else {
          setData(bookmarksResponse.data.result);
        }
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
        setErrorMsg(bookmarksResponse.data.message);
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
    // console.log(response.result);
    // console.log(response.result.commonCodeList[2].codes);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="w-full h-48 flex justify-center items-center text-4xl">
          Loading...
        </div>
      ) : !isSuccess ? (
        <div className="text-center">{errorMsg}</div>
      ) : (
        <ul className="flex flex-col gap-4">
          {data.map((member) => (
            <li key={member.memberUuid} className="card flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                <div
                  className="rounded-full overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/user/${member.memberUuid}`)}
                >
                  <img
                    src={member.memberImg}
                    alt={member.memberNickName}
                    style={{ width: "144px", height: "144px" }}
                  />
                </div>
                <div className="flex flex-col grow gap-2">
                  <div className="flex justify-between">
                    <button
                      onClick={() => router.push(`/user/${member.memberUuid}`)}
                    >
                      {member.memberNickName}
                    </button>
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
                    {member.memberIntro && isExpanded
                      ? member.memberIntro.split("\n").map((line, index) => (
                          <React.Fragment key={index}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))
                      : member.memberIntro?.split("\n")[0]}
                    {member.memberIntro?.split("\n").length > 1 && (
                      <button onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? "[간략히]" : "[더보기]"}
                      </button>
                    )}
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
                        borderRadius: "9999px",
                        backgroundColor: `${colorMapping[skill.codeName]}`,
                      }}
                    >
                      <p className="text-white px-1">{skill.codeName}</p>
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
