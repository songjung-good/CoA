import Image from "next/image";
import Link from "next/link";
import tw from "tailwind-styled-components";

import useResultStore from "@/store/result";

export default function RepoInfo() {
  // 통신 결과로 setRepoInfo를 업데이트
  const repoInfo = useResultStore((state) => state.result.repoCardDto);

  const projectDays = calculateDaysBetweenDates(
    repoInfo.repoStartDate,
    repoInfo.repoEndDate,
  );
  return (
    <RepoInfoDiv>
      <div className="flex flex-col items-start">
        <div className="flex items-center mb-5">
          {repoInfo.repoViewPath.includes("github") ? (
            <Image
              src="/image/githubSSO.png"
              alt="github logo"
              width={30}
              height={30}
            ></Image>
          ) : (
            <Image src="" alt="gitlab logo" width={30} height={30}></Image>
          )}
          <Link href={`${repoInfo.repoViewPath}`} className="ml-2 font-bold">
            {repoInfo.repoViewPath}
          </Link>
        </div>
        <p className="text-2xl font-semibold lg:text-4xl mb-5">
          {repoInfo.repoViewTitle}
        </p>
        <p className="text-xl font-bold lg:text-2xl mb-2">
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
  w-full min-h-20 h-1/4 flex flex-wrap justify-between shadow-lg bg-white rounded-2xl p-5 space-y-2 overflow-hidden
  overflow-x-auto
  `;

function calculateDaysBetweenDates(startDate: string, endDate: string) {
  const start = new Date(startDate).getTime(); // Date를 밀리초 단위 타임스탬프로 변환
  const end = new Date(endDate).getTime(); // Date를 밀리초 단위 타임스탬프로 변환
  const difference = end - start; // 밀리초 단위로 날짜 차이 계산
  const days = difference / (1000 * 60 * 60 * 24); // 밀리초를 일수로 변환
  return Math.ceil(days); // 소수점이 있는 경우를 대비해 올림 처리
}
