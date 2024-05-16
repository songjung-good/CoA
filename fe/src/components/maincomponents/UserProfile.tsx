"use client";

import Link from "next/link";
import UseAxios from "@/api/common/useAxios";
import { useEffect, useState } from "react";
import { colorMapping } from "@/components/colorMap";
import useCommonCodeStore from "@/store/commoncode";
import tw from "tailwind-styled-components"

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

interface AccountLinkInfoDto {
  githubNickName: string;
  isGithubToken: boolean;
  gitlabNickName: string;
  isGitlabToken: boolean;
  solvedacNickName: string;
  codeforcesNickName: string;
}

interface UserInfo {
  memberUuid: string;
  memberImg: string;
  memberNickName: string;
  accountLinkInfoDto: AccountLinkInfoDto;
}

interface ApiResponse {
  result: Member;
}

const ProfileHead = tw.div`
  flex
  justify-between
  mx-[5%]
  items-center
  border-b-2
`;

export default function UserProfile() {
  const axios = UseAxios();
  const { response } = useCommonCodeStore.getState();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    memberUuid: "",
    memberImg: "",
    memberNickName: "",
    accountLinkInfoDto: {
      githubNickName: "",
      isGithubToken: false,
      gitlabNickName: "",
      isGitlabToken: false,
      solvedacNickName: "",
      codeforcesNickName: "",
    },
  });

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
        console.log(res.data.result);
        setUserInfo(res.data.result);
      })
      .catch((error) => {
        console.error("Failed to fetch user info:", error);
      });
  }, []);

  // 두 번째 useEffect: userInfo.memberUuid가 변경될 때 userCard를 가져오는 요청
  useEffect(() => {
    if (userInfo.memberUuid) {
      axios
        .get(`/api/member/${userInfo.memberUuid}`)
        .then((res) => {
          console.log(res.data.result);
          setUserCard(res.data.result);
        })
        .catch((error) => {
          console.error("Failed to fetch user card:", error);
        });
    }
  }, [userInfo.memberUuid]);

  return (
    <div className="w-full sm:w-1/3 flex flex-col mt-10 sm:mt-0 px-2 sm:ml-4 bg-white shadow-lg rounded-lg border hover:border-appBlue2 py-6 min-h-[300px]">
      <ProfileHead>
        <div className="flex justify-start items-center h-1/3 min-h-[60px]">
          <img
            src={userCard?.memberImg || `/image/LoadingSpinner.gif`}
            alt="member image"
            className="rounded-full w-1/6"
          />
          <p className="m-[5%] text-base sm:text-base">{userCard.memberNickName}</p>
        </div>
        <Link href={`/user/${userInfo.memberUuid}`}>
          <span className="text-md font-bold text-end mr-4 text-gray-400 hover:text-appRed">
            마이페이지&#10097;{" "}
          </span>
        </Link>
      </ProfileHead>
      <div className="h-full">
        <div className="flex justify-between mx-[5%] my-[2%] ">
          <div className="flex flex-col items-start mt-2">
            <div className="flex justify-center items-center">
              <img
                src="/image/oauth/github-mark.svg"
                alt="github logo"
                width={20}
                height={20}
                className="mr-2"
              />
              {userInfo.accountLinkInfoDto.githubNickName ? (
                <p className=" font-medium">
                  {userInfo.accountLinkInfoDto.githubNickName}
                </p>
              ) : (
                <Link href={"/auth/link"}>
                  <button className=" font-medium">연동하기</button>
                </Link>
              )}
            </div>
            <div className="flex justify-center items-center">
              <img
                src="/image/oauth/gitlab-mark.svg"
                alt="gitlab logo"
                width={20}
                height={20}
                className="mr-2"
              />
              {userInfo.accountLinkInfoDto.gitlabNickName ? (
                <p className=" font-medium">
                  {userInfo.accountLinkInfoDto.gitlabNickName}
                </p>
              ) : (
                <Link href={"/auth/link"}>
                  <button className=" font-medium">연동하기</button>
                </Link>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center ">
            <p className="text-nowrap">포지션</p>
            <p>
              {response?.result.commonCodeList[2]?.codes &&
                response.result.commonCodeList[2].codes[
                  `${userCard?.memberJobCodeId}`
                ]}
            </p>
          </div>
        </div>
        <div className="skills-container flex justify-between items-center mx-[3%] my-[3%]">
          <p>
            기술스택:
          </p>
          <ul className="flex flex-wrap gap-2 p-1">
            {userCard?.skillList.slice(0, 4).map((skill) => (
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
            {userCard.skillList.length > 4 && (
              <li>
                <p className="bg-white px-1">...</p>
              </li>
            )}
          </ul>
        </div>
        <div className="bg-appGrey1 p-4 rounded-2xl grow truncate">
          <p className="truncate">{userCard?.memberIntro}</p>
        </div>
      </div>
    </div>
  );
}
