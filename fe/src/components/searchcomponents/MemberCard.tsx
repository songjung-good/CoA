import React from 'react';
import tw from 'tailwind-styled-components';

// 타입 정의
interface MemberSearchResult {
  memberId: string;
  memberNickName: string;
  memberImg: string;
  memberIntro: string;
  skillList: string[];
  memberJobCodeId: number;
  isMine: boolean;
  isBookmark: boolean;
}

interface MemberCardProps {
  memberInfo: MemberSearchResult;
}

const MemberCard: React.FC<MemberCardProps> = ({ memberInfo }) => {
  return (
    <MemberInfoDiv>
      <div className="flex flex-col items-start">
        <div className="flex items-center mb-5">
          <Image
            src={memberInfo.memberImg}
            alt="member image"
            width={50}
            height={50}
            className="rounded-full"
          />
          <p className="ml-2 font-bold">{memberInfo.memberNickName}</p>
        </div>
        <p className="text-sm mb-2 truncate">{memberInfo.memberIntro}</p>
        <div className="flex flex-wrap">
          {memberInfo.skillList.map((skill, index) => (
            <span key={index} className="m-1 bg-gray-200 rounded-full px-4 py-1 text-sm">
              {skill}
            </span>
          ))}
        </div>
        <div className="mt-2">
          {memberInfo.isBookmark ? (
            <p className="text-blue-500 font-bold">북마크됨</p>
          ) : (
            <p className="text-gray-500 font-bold">북마크하기</p>
          )}
        </div>
      </div>
    </MemberInfoDiv>
  );
};

const MemberInfoDiv = tw.div`
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
  object-cover
  rounded-full
`

export default MemberCard;
