// 라이브러리
import React, { useState } from "react";
import Link from "next/link";
import tw from "tailwind-styled-components";
import { useRouter } from "next/navigation";
// 컴포넌트
import UseAxios from "@/api/common/useAxios";
import useRepoDetailStore from "@/store/repodetail";

// 타입 정의
interface Skill {
  codeId: number;
  codeName: string;
}

interface RepoCardDto {
  memberUuid: string;
  memberNickname: string;
  memberImg: string;
  repoViewId: number;
  repoViewPath: string;
  repoViewTitle: string;
  repoViewSubtitle: string;
  repoMemberCnt: number;
  skillList: Skill[];
  repoStartDate: string;
  repoEndDate: string;
  isMine: boolean;
}

interface ResultDTO {
  data: RepoCardDto;
}

const axios = UseAxios();

const RepoCard: React.FC<ResultDTO> = (data) => {
  const result = data.data;
  const skill = data.data.skillList;
  const repoViewId = result.repoViewId;

  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const setRepoDetail = useRepoDetailStore((state) => state.updateResultState);

  const handleDetailClick = async (repoViewId: number) => {
    try {
      const response = await axios.get(`/api/repos/${repoViewId}`);
      setRepoDetail(response.data);
    } catch (error) {
      console.error(error);
    }
    router.push(`/repo/${repoViewId}`);
  };

  return (
    <RepoInfoDiv>
      <Header>
        <div className="flex items-center">
          {result.repoViewPath.includes("github") ? (
            <ProfileImg src="/image/githubSSO.svg" alt="github logo" />
          ) : (
            <ProfileImg src="/image/gitlabSSO.svg" alt="gitlab logo" />
          )}
          <Link href={result.repoViewPath} className="font-bold truncate">
            <Title>{result.repoViewTitle}</Title>
          </Link>
        </div>
        <div className="flex items-center">
          <ProfileImg src={result.memberImg} alt="member image" />
          <p className="ml-2 font-bold">{result.memberNickname}</p>
        </div>
      </Header>
      <Body>
        <p className="text-xl mb-2 truncate">{result.repoViewSubtitle}</p>
        <p className="font-bold">
          프로젝트 기간: {`${result.repoStartDate} ~ ${result.repoEndDate}`}
        </p>
        {/* <p className="font-bold">
          프로젝트 참여 인원: {result.repoMemberCnt}
        </p> */}
      </Body>
      <Skill>
        <div className="flex flex-wrap">
          {skill.map((skill: Skill, index: number) => (
            <span
              key={index}
              className="m-1 bg-gray-200 rounded-full px-4 py-1 text-sm"
            >
              {skill.codeName}
            </span>
          ))}
        </div>
        <Button
          className="flex items-center"
          onClick={() => handleDetailClick(repoViewId)}
        >
          상세 정보 보기 &nbsp;
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </Button>
      </Skill>
    </RepoInfoDiv>
  );
};

const RepoInfoDiv = tw.div`
  relative
  w-full
  min-h-20
  lg:flex-row
  flex-wrap
  justify-between
  shadow-lg
  bg-white
  rounded-2xl
  p-5
  space-y-2
  transition-all
  border-2 border-transparent
  hover:border-appBlue3
`;

const Header = tw.div`
  flex
  justify-between
  items-center
  mb-5
`;

const ProfileImg = tw.img`
  rounded-full
  mr-2
  h-10
  w-10
`;

const Title = tw.p`
  font-bold
  truncate
  ml-2
  text-xl
`;

const Body = tw.div`
  mb-5
`;

const Skill = tw.div`
  flex
  justify-between
  mt-2
`;

const Button = tw.button`
  bg-appYellow
  text-black
  p-2
  mx-2
  transition-all
  hover:bg-appBlue1
  hover:text-white
`;

export default RepoCard;
