"use client";

import Image from "next/image";
import Link from "next/link";
import tw from "tailwind-styled-components";
import { colorMapping } from "@/components/colorMap";
import { useState, useEffect } from "react";

// import file
import EditIcon from "@/icons/EditIcon";

// store
// import useResultStore from "@/store/result";
import useRepoDetailStore from "@/store/repodetail";

// TypeScript 인터페이스로 Props 타입 정의
interface RepoInfoProps {
  openModal: () => void; // 모달을 여는 함수
}

const RepoInfo: React.FC<RepoInfoProps> = ({ openModal }) => {
  // 통신 결과로 setRepoInfo를 업데이트
  const repoInfo = useRepoDetailStore((state) => state.result.repoCardDto);

  const [isEditHover, setIsEditHover] = useState(false);

  // 프로젝트 일수 계산
  const projectDays = calculateDaysBetweenDates(
    repoInfo.repoStartDate,
    repoInfo.repoEndDate,
  );

  return (
    <RepoInfoDiv>
      <div className="flex flex-col lg:flex-row items-start justify-between w-full ">
        <div className="w-full lg:w-2/3">
          <div className="flex w-full items-center mb-5">
            {repoInfo.repoViewPath.includes("github") ? (
              <Image
                src="/image/githubSSO.svg"
                alt="github logo"
                width={30}
                height={30}
              />
            ) : (
              <Image
                src="/image/oauth/gitlab-mark.svg"
                alt="gitlab logo"
                width={30}
                height={30}
              />
            )}
            <Link
              href={`${repoInfo.repoViewPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 font-bold truncate"
            >
              {repoInfo.repoViewPath}
            </Link>
          </div>
          <p className="text-2xl font-bold lg:text-3xl mb-5 truncate">
            {repoInfo.repoViewTitle}
          </p>
          <p className="text-xl lg:text-2xl mb-2 truncate">
            {repoInfo.repoViewSubtitle}
          </p>
        </div>
        <div className="w-full lg:w-3/5 h-full lg:flex lg:flex-col lg:justify-between">
          <div className="mb-2 flex flex-col justify-between items-start lg:items-end w-full h-full">
            <div>
              <p>
                분석 대상 :
                <Link href={`/user/${repoInfo.memberUuid}`}>
                  <span className="text-appPink hover:cursor-pointer">{` ${repoInfo.memberNickname} `}</span>
                </Link>
                님
              </p>
              <p className=" text-start w-full whitespace-pre-wrap break-words">
                프로젝트 기간 :
                {`${repoInfo.repoStartDate} ~ ${repoInfo.repoEndDate} `}
                <span className="font-bold ml-1">{`(${projectDays}일)`}</span>
              </p>
              <p className="text-start">
                프로젝트 인원 :{" "}
                {<span className="font-bold">{repoInfo.repoMemberCnt} </span>}{" "}
                명
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-end w-full h-full">
        {repoInfo.skillList === null ? (
          <div className="flex-grow">
            프로젝트에 사용한 기술 스택을 추가해주세요
          </div>
        ) : (
          <ul className="flex flex-wrap w-4/5">
            {repoInfo.skillList.map((skill, index) => (
              <li
                key={index}
                className={`flex text-white justify-between items-center px-4 py-2 mr-4 mb-2 shadow-lg rounded-lg font-bold`}
                style={{
                  padding: "6px 8px",
                  borderRadius: "9999px",
                  backgroundColor: `${colorMapping[skill.codeName]}`,
                }}
              >
                <p className="px-2 ">{skill.codeName}</p>
              </li>
            ))}
          </ul>
        )}
        {repoInfo.isMine && (
          <div className="mt-2 sm:mt-0 flex-grow flex justify-end items-end h-full">
            <button
              className="bg-appBlue1 hover:bg-blue-500 text-nowrap text-white font-bold px-4 py-2 rounded-full flex justify-center items-center text-sm md:text-lg"
              onClick={openModal}
            >
              <EditIcon width={20} height={20} />
              수정하기
            </button>
          </div>
        )}
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
