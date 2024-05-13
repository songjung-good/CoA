"use client";

import Image from "next/image";
import Link from "next/link";
import tw from "tailwind-styled-components";
import { useState, useEffect } from "react";

// import file
import EditIcon from "@/icons/EditIcon";

// store
import useResultStore from "@/store/result";

const RepoInfo: React.FC = () => {
  // 통신 결과로 setRepoInfo를 업데이트
  const repoInfo = useResultStore((state) => state.result.repoCardDto);

  // 프로젝트 일수 계산
  const projectDays = calculateDaysBetweenDates(
    repoInfo.repoStartDate,
    repoInfo.repoEndDate,
  );

  return (
    <RepoInfoDiv>
      <div className="flex flex-col lg:flex-row items-start justify-between w-full lg:min-w-[800px]">
        <div>
          <div className="flex items-center mb-5">
            {repoInfo.repoViewPath.includes("github") ? (
              <Image
                src="/image/githubSSO.png"
                alt="github logo"
                width={30}
                height={30}
              />
            ) : (
              <Image src="" alt="gitlab logo" width={30} height={30} />
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
            {repoInfo.repoViewSubtitle ? (
              <span>{repoInfo.repoViewSubtitle}</span>
            ) : (
              <span>부제목을 작성해주세요.</span>
            )}
          </p>
        </div>
        <div className="w-full h-full lg:flex lg:flex-col lg:justify-between">
          <div className="mb-2 flex flex-col justify-between items-start lg:items-end w-full h-full">
            <div>
              <p className="font-extrabold text-start">
                프로젝트 기간 :
                {`${repoInfo.repoStartDate} ~ ${repoInfo.repoEndDate} (${projectDays}일)`}
              </p>
              <p className="font-extrabold text-start">
                프로젝트 인원: {repoInfo.repoMemberCnt}명
              </p>
            </div>
          </div>
          <div className="flex-col justify-end">
            <div className="flex flex-row justify-start lg:justify-end">
              {repoInfo.skillList === null ? (
                <div className="font-bold">
                  프로젝트에 사용한 기술 스택을 추가해주세요
                </div>
              ) : (
                <div>
                  {repoInfo.skillList.map((e) => (
                    <div>{e.codeName}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RepoInfoDiv>
  );
};

const RepoInfoDiv = tw.div`
  w-full min-h-20 flex flex-col lg:flex-row lg:min-w-[800px] flex-wrap justify-between shadow-lg bg-white rounded-2xl p-5 space-y-2
`;

function calculateDaysBetweenDates(startDate: string, endDate: string) {
  const start = new Date(startDate).getTime(); // Date를 밀리초 단위 타임스탬프로 변환
  const end = new Date(endDate).getTime(); // Date를 밀리초 단위 타임스탬프로 변환
  const difference = end - start; // 밀리초 단위로 날짜 차이 계산
  const days = difference / (1000 * 60 * 60 * 24); // 밀리초를 일수로 변환
  return Math.ceil(days); // 소수점이 있는 경우를 대비해 올림 처리
}
export default RepoInfo;
