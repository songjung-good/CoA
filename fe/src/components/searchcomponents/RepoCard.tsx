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

  return (
    <RepoInfoDiv>
      <Header>
        <div className="flex items-center">
          {repoInfo.url.includes("github") ? (
            <ProfileImg
              src="/image/githubSSO.svg"
              alt="github logo"
            />
          ) : (
            <ProfileImg
              src="/image/gitlabSSO.svg"
              alt="gitlab logo"
            />
          )}
          <Link href={repoInfo.url} className="font-bold truncate">
            <Title>{repoInfo.repoViewTitle}</Title>
          </Link>
        </div>
        <div className="flex items-center">
          <ProfileImg
            src={repoInfo.memberImg}
            alt="member image"
          />
          <p className="ml-2 font-bold">{repoInfo.memberNickName}</p>
        </div>
      </Header>
      <Body>
        <p className="text-xl mb-2 truncate">{repoInfo.repoViewSubTitle}</p>
        <p className="font-bold">
          프로젝트 기간: {`${repoInfo.dateRange.startDate} ~ ${repoInfo.dateRange.endDate}`}
        </p>
      </Body>
      <div className="flex flex-wrap">
        {repoInfo.skillList.map((skill, index) => (
          <span key={index} className="m-1 bg-gray-200 rounded-full px-4 py-1 text-sm">
            {skill}
          </span>
        ))}
      </div>
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
`

const Body = tw.div`
  mb-5
`;

export default RepoCard;
