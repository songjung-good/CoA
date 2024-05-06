import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import tw from "tailwind-styled-components";

const test = {
  site: "github",
  url: "https://github.com/",
  title: "제목입니다.",
  subTitle: "부제목입니다.",
  startDay: "2024-04-01",
  endDay: "2024-06-01",
  members: 6,
  starts: 32,
};

export default function RepoInfo() {
  const [repoInfo, setRepoInfo] = useState({
    site: "",
    url: "",
    title: "",
    subTitle: "",
    startDay: "",
    endDay: "",
    members: 0,
    starts: 0,
  });

  // 통신 결과로 setRepoInfo를 업데이트
  useEffect(() => {
    setRepoInfo(test); // 테스트 데이터로 상태 업데이트
  }, []);

  return (
    <RepoInfoDiv>
      <div className="flex items-center w-1/2">
        {repoInfo.site === "github" ? (
          <Image
            src="/image/githubSSO.png"
            alt="github logo"
            width={30}
            height={30}
          ></Image>
        ) : (
          <Image
            src="/image/githubSSO.png"
            alt="gitlab logo"
            width={30}
            height={30}
          ></Image>
        )}
        <Link href={`${repoInfo.url}`} className="ml-2 font-bold">
          {repoInfo.url}
        </Link>
      </div>

      <p className="text-2xl font-semibold lg:text-4xl">{repoInfo.title}</p>
      <p className="text-xl font-bold lg:text-2xl">{repoInfo.subTitle}</p>
      <p>프로젝트 기간 : {`${repoInfo.startDay} ~ ${repoInfo.endDay}`}</p>
      {/* 프로젝트 기간 일수 (date 타입 으로 넘어오면 계산하기) */}
      <p>프로젝트 인원: {repoInfo.members}명</p>
      <GitStar>
        <Image
          src="/image/githubSSO.png"
          alt="github logo"
          width={20}
          height={20}
          color="white"
        ></Image>
        <span className="ml-1">⭐</span>
        <span className="ml-1">Star</span>
        <span className=" font-bold ml-1">{repoInfo.starts}</span>
      </GitStar>
    </RepoInfoDiv>
  );
}

const RepoInfoDiv = tw.div`
  w-full min-h-60 h-1/4 flex flex-col justify-center shadow-lg bg-white rounded-2xl p-5 space-y-2
`;

const GitStar = tw.div`
  max-w-36 flex justify-center items-center bg-black text-white rounded-full px-2 py-1
`;
