"use client";
// 라이브러리
import Image from "next/image";
import Link from "next/link";
import tw from "tailwind-styled-components";
import { useState } from "react";
// 전역데이터
import EditIcon from "@/icons/EditIcon";
import useRepoDetailStore from "@/store/repodetail";

export default function RepoInfo() {
  const repoInfo = useRepoDetailStore((state) => state.result.repoCardDto);
  const [isEditHover, setIsEditHover] = useState(false);

  // 프로젝트 일수 계산
  const projectDays = calculateDaysBetweenDates(
    repoInfo.repoStartDate,
    repoInfo.repoEndDate,
  );

  return (
    <RepoInfoDiv>
      {repoInfo.isMine && (
        <div className="absolute -bottom-8 -right-8 z-10 p-4">
          <div className="relative">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-full"
              onMouseEnter={() => {
                setIsEditHover(true);
              }}
              onMouseLeave={() => {
                setIsEditHover(false);
              }}
            >
              <EditIcon width={20} height={20} />
            </button>
            {isEditHover && (
              <div className="absolute -right-5 flex whitespace-nowrap p-2 mt-2 bg-white shadow-lg rounded-lg z-20 text-center">
                수정하기
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex flex-col items-start">
        <div className="flex items-center mb-5">
          {repoInfo.repoViewPath.includes("github") ? (
            <Image
              src="/image/githubSSO.svg"
              alt="github logo"
              width={30}
              height={30}
            ></Image>
          ) : (
            <Image
              src="/image/googleSSO.png"
              alt="gitlab logo"
              width={30}
              height={30}
            ></Image>
          )}
          <Link
            href={`${repoInfo.repoViewPath}`}
            className="ml-2 font-bold truncate"
          >
            {repoInfo.repoViewPath}
          </Link>
        </div>
        <p className="text-2xl font-semibold lg:text-3xl mb-5 truncate">
          {repoInfo.repoViewTitle}
        </p>
        <p className="text-xl font-bold lg:text-2xl mb-2 truncate">
          {repoInfo.repoViewSubtitle}
        </p>
      </div>
      <div className="mb-2">
        <p className="font-extrabold">
          프로젝트 기간 :
          {`${repoInfo.repoStartDate} ~ ${repoInfo.repoEndDate} (${projectDays}일)`}
        </p>
        <p className="font-extrabold">
          프로젝트 인원: {repoInfo.repoMemberCnt}명
        </p>
      </div>
    </RepoInfoDiv>
  );
}

const RepoInfoDiv = tw.div`
  relative 
  w-full 
  min-h-20 
  flex flex-col 
  lg:flex-row 
  flex-wrap 
  justify-between 
  shadow-lg 
  bg-white 
  rounded-2xl 
  p-5 
  space-y-2
  `;

function calculateDaysBetweenDates(startDate: string, endDate: string) {
  const start = new Date(startDate).getTime(); // Date를 밀리초 단위 타임스탬프로 변환
  const end = new Date(endDate).getTime(); // Date를 밀리초 단위 타임스탬프로 변환
  const difference = end - start; // 밀리초 단위로 날짜 차이 계산
  const days = difference / (1000 * 60 * 60 * 24); // 밀리초를 일수로 변환
  return Math.ceil(days); // 소수점이 있는 경우를 대비해 올림 처리
}
