// UserModal은 레포지토리의 기여자를 모달 형태로 보여주는 컴포넌트
// 라이브러리
import React, { useState } from 'react';
import tw from 'tailwind-styled-components';
import axios from 'axios';

// 타입 정리
interface UserModalProps {
  userData: {
    data: User[];
    projectId? : number;
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

  let borderColor = 'border-gray-200';
  if (isHovered) borderColor = 'border-gray-500';
  if (isSelected) borderColor = 'border-blue-500';

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

// axios를 이용해 서버로 사용자 데이터를 요청
const requestAnalysis = async (repoUrl: string, userName: any, projectId: any) => {
  try {
    const response = await axios.post('/api/repos/analysis', {
      repoUrl,
      userName,
      projectId,
    });
  } catch (error) {
    console.error(error);
  }
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

  return (
    <ModalOverlay>
      <ModalContent>
      <ModalCloseButton onClick={closeModal}>
        X
      </ModalCloseButton>
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
      <div>
        <p>프로젝트 URL : {url}</p>
        <p>분석대상 : {selectedUser?.login} {selectedUser?.username}</p>
      </div>
      <div>
      <button 
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        onClick={() => requestAnalysis(url, selectedUser!.login||selectedUser!.username, userData.projectId)}
      >
        분석하기
      </button>
        </div>
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
  text-black 
  top-2.5 
  right-2.5
  bg-orange-500 
  border-none 
  rounded-full 
  w-7 
  h-7 
  flex 
  justify-center
  items-center 
  cursor-pointer
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

export default UserModal;
