// UserModal은 레포지토리의 기여자를 모달 형태로 보여주는 컴포넌트
// 라이브러리
import React, { useState } from "react";
import tw from "tailwind-styled-components";
import UseAxios from "@/api/common/useAxios";

//stroe
import useAnalyzingStore from "@/store/analyze";

// 타입 정리
interface UserModalProps {
  userData: {
    data: User[];
    projectId?: number;
  };
  onClose: () => void;
  url: string;
}

interface User {
  avatar_url: string;
  id: number;
  login: string;
  type: string;
  url: string;
  projectId: number;
  repositoryName: string;
  username?: string;
}

type UserAvatarProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  isSelected?: boolean;
};

// 프로젝트에 기여한 사용자의 사진을 클릭할 수 있게 하는 컴포넌트
const UserAvatar = ({ src, alt, isSelected, ...props }: UserAvatarProps) => {
  const [isHovered, setIsHovered] = useState(false); // hover 상태 추가

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  let borderColor = "border-gray-200";
  if (isHovered) borderColor = "border-gray-500";
  if (isSelected) borderColor = "border-blue-500";

  return (
    <img
      src={src}
      alt={alt}
      className={`w-full max-w-[100px] h-auto rounded-full border-2 ${borderColor}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    />
  );
};

// 모달을 구성
const UserModal: React.FC<UserModalProps> = ({ userData, onClose, url }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const toggleUser = (user: User) => {
    setSelectedUser(selectedUser?.id === user.id ? null : user);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setSelectedUser(null);
    onClose(); // 부모 컴포넌트로부터 받은 모달 닫기 함수 호출
  };

  // axios를 이용해 서버로 사용자 데이터를 요청
  const requestAnalysis = async (
    repoUrl: string,
    userName: any,
    projectId: any,
  ) => {
    const axios = UseAxios();
    try {
      await axios
        .post("/api/repos/analysis", {
          repoUrl,
          userName,
          projectId,
        })
        .then((res) => {
          // console.log(res);
          useAnalyzingStore.getState().setAnalyzeId(res.data.result);
        })
        .then((res) => {
          useAnalyzingStore.getState().startAnalysis();
        })
        .then((res) => {
          onClose();
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <div className="flex justify-between item-center mx-1 my-1">
          <text className="font-bold text-xl mb-1">분석 대상</text>
          <div className="flex ">
            <ModalCloseButton onClick={closeModal}>닫기</ModalCloseButton>
          </div>
        </div>
        {userData.data && (
          <ModalUserGrid>
            {userData.data.map((user, index) => (
              <ModalUser key={index} onClick={() => toggleUser(user)}>
                <UserAvatar
                  src={user.avatar_url}
                  alt={user.login}
                  isSelected={selectedUser?.id === user.id}
                />
                <UserId>{user.login}</UserId>
                <UserId>{user.username}</UserId>
              </ModalUser>
            ))}
          </ModalUserGrid>
        )}
        {!userData.data && <p>사용자 데이터를 가져올 수 없습니다.</p>}
        <div className="mb-2 border-t-2 ">
          <p className="flex mt-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
            {url}
          </p>
          <p className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            <p className="font-bold ">
              {selectedUser?.login} {selectedUser?.username}
            </p>
          </p>
        </div>
        <AnalyzerButton
          onClick={() =>
            requestAnalysis(
              url,
              selectedUser!.login || selectedUser!.username,
              userData.projectId,
            )
          }
        >
          분석하기
        </AnalyzerButton>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = tw.div`
  fixed 
  top-0 
  left-0 
  w-full 
  h-full 
  bg-black 
  bg-opacity-50 
  z-40 
  flex 
  justify-center 
  items-center
`;

const ModalCloseButton = tw.button`
  bg-white
  hover:bg-appRed
  hover:text-white
  text-gray-800
  font-semibold
  py-1
  px-4
  border
  border-gray-400
  rounded
  shadow
`;

const ModalContent = tw.div`
  bg-white 
  p-5 
  rounded-lg
`;

const ModalUserGrid = tw.div`
  grid 
  grid-cols-3 
  gap-5
  max-h-[60vh]
  overflow-y-auto
`;

const ModalUser = tw.div`
  flex 
  flex-col 
  items-center 
  cursor-pointer 
  m-2.5
`;

const UserId = tw.p`
  mt-2.5 
  max-w-[100px] 
  text-center 
  whitespace-nowrap 
  overflow-hidden 
  overflow-ellipsis
`;

const AnalyzerButton = tw.button`
  bg-white 
  hover:bg-appBlue1 
  hover:text-white 
  text-gray-800 
  font-semibold 
  py-1 
  px-4 
  border 
  border-gray-400 
  rounded 
  shadow
  justify-center
  w-full
`;

export default UserModal;
