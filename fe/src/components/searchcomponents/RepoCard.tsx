import React from 'react';
import Link from 'next/link';
import tw from 'tailwind-styled-components';

// 타입 정의
interface RepoSearchResult {
  url: string,
  memberId: string;
  memberNickName: string;
  memberImg: string;
  repoViewId: number;
  repoViewTitle: string;
  repoViewSubTitle: string;
  repoMemberCnt: number;
  skillList: string[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  isMine: boolean;
}

interface RepoCardProps {
  repoInfo: RepoSearchResult;
}

const RepoCard: React.FC<RepoCardProps> = ({ repoInfo }) => {
  const [isEditHover, setIsEditHover] = React.useState(false);

  return (
    <RepoInfoDiv>
      {repoInfo.isMine && (
        <div className="absolute -bottom-8 -right-8 z-10 p-4">
          <div className="relative">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-full"
              onMouseEnter={() => setIsEditHover(true)}
              onMouseLeave={() => setIsEditHover(false)}
            >
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
          <Image
            src={repoInfo.memberImg}
            alt="member image"
            width={50}
            height={50}
            className="rounded-full"
          />
          <p className="ml-2 font-bold">{repoInfo.memberNickName}</p>
        </div>
        <div className="flex items-center mb-5">
          {repoInfo.url.includes("github") ? (
            <Image
              src="/image/githubSSO.png"
              alt="github logo"
              width={30}
              height={30}
            />
          ) : (
            <Image
              src="/image/googleSSO.png"
              alt="gitlab logo"
              width={30}
              height={30}
            />
          )}
          <Link href={repoInfo.url} className="ml-2 font-bold truncate">
            {repoInfo.repoViewTitle}
          </Link>
        </div>
        <p className="text-xl mb-2 truncate">{repoInfo.repoViewSubTitle}</p>
        <div className="mb-2">
          <p className="font-bold">
            프로젝트 기간: {`${repoInfo.dateRange.startDate} ~ ${repoInfo.dateRange.endDate}`}
          </p>
          <p className="font-bold">
            프로젝트 인원: {repoInfo.repoMemberCnt}명
          </p>
        </div>
        <div className="flex flex-wrap">
          {repoInfo.skillList.map((skill, index) => (
            <span key={index} className="m-1 bg-gray-200 rounded-full px-4 py-1 text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </RepoInfoDiv>
  );
};

const RepoInfoDiv = tw.div`
  relative
  w-full
  min-h-20
  flex
  flex-col
  lg:flex-row
  flex-wrap
  justify-between
  shadow-lg
  bg-white
  rounded-2xl
  p-5
  space-y-2
`;

const Image = tw.img`
  w-20
  h-20
  rounded-full
`;

export default RepoCard;
