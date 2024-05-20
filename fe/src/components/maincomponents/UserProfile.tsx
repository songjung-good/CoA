"use client";

import Link from "next/link";
import UseAxios from "@/api/common/useAxios";
import { useEffect, useState } from "react";
import { colorMapping } from "@/components/colorMap";
import useCommonCodeStore from "@/store/commoncode";
import tw from "tailwind-styled-components";

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
          setUserCard(res.data.result);
        })
        .catch((error) => {
          console.error("Failed to fetch user card:", error);
        });
    }
  }, [userInfo.memberUuid]);

  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className="w-full sm:w-1/3 flex flex-col mt-10 sm:mt-0 px-2 sm:ml-4 bg-white shadow-lg rounded-lg border py-2 min-h-[300px]">
      <ProfileHead>
        <Link href={`/user/${userInfo.memberUuid}`} className="flex justify-start items-center h-1/3 min-h-[60px] hover:text-appRed">
          <img
            src={userCard?.memberImg || `/image/LoadingSpinner.gif`}
            alt="member image"
            className="rounded-full w-1/6"
          />
          <p className="m-[5%] font-bold sm:text-base">
            {userCard.memberNickName}
          </p>
          {/* <span className="text-end mr-4 text-gray-400 hover:text-appRed md:text-md sm:text-sm">
            마이페이지&#10097;{" "}
          </span> */}
        </Link>
        <div className="flex mt-[2%] flex-col justify-center items-center ">
          <p className="text-nowrap text-sm">포지션</p>
          <p className="font-light">
            {response?.result.commonCodeList[2]?.codes &&
              response.result.commonCodeList[2].codes[
                `${userCard?.memberJobCodeId}`
              ]}
          </p>
        </div>
      </ProfileHead>
      <div className="h-full ">
        <div className="flex justify-between mx-[5%] my-[2%] pb-2 border-t border-b">
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
                <p className="  ">
                  {userInfo.accountLinkInfoDto.githubNickName}
                </p>
              ) : (
                <Link href={"/auth/link"}>
                  <button className=" ">연동하기</button>
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
                <p className=" ">
                  {userInfo.accountLinkInfoDto.gitlabNickName}
                </p>
              ) : (
                <Link href={"/auth/link"}>
                  <button className=" ">연동하기</button>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="skills-container flex flex-col justify-between mx-[3%] my-[5%] xl:flex-row">
          <p className=" ">기술스택</p>
          <ul className="flex flex-wrap justify-center items-center gap-2 p-1">
            {userCard?.skillList.slice(0, 3).map((skill) => (
              <li
                key={skill.codeId}
                style={{
                  padding: "1px",
                  borderRadius: "9999px",
                  backgroundColor: `${colorMapping[skill.codeName]}`,
                }}
              >
                <p className="text-xs text-white px-1">{skill.codeName}</p>
              </li>
            ))}
            {userCard.skillList.length > 3 && (
              <li
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative"
              >
                <p className="bg-white px-1 text-xs">
                  +{userCard.skillList.length - 3}개
                </p>
                {showTooltip && (
                  <div className="absolute left-0 top-full mt-2 min-w-[30%] p-2 bg-gray-700 text-white text-xs rounded-lg shadow-lg">
                    {userCard.skillList.slice(3).map((skill) => (
                      <p key={skill.codeId}>{skill.codeName}</p>
                    ))}
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
        <div className="bg-appGrey1 p-4 rounded-2xl grow truncate">
          <p className="truncate text-xs">{userCard?.memberIntro}</p>
        </div>
      </div>
    </div>
  );
}

const ProfileHead = tw.div`
  flex
  justify-between
  mx-[5%]
  items-center
`;