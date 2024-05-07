// UserModal은 레포지토리의 기여자를 모달 형태로 보여주는 컴포넌트
import React, { useState } from 'react';
import tw from 'tailwind-styled-components';
import { css } from 'styled-components';

// 타입 정리
interface UserModalProps {
  userData: {
    data: User[];
    projectId? : number;
  };
  onClose: () => void;
}

interface User {
  avatar_url: string;
  id: number;
  login: string;
  username?: string;
  type: string;
  url: string;
  projectId: number;
  repositoryName: string;
}

interface AvatarProps {
  isSelected?: boolean;
}

type UserAvatarProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  isSelected?: boolean;
};


const UserModal: React.FC<UserModalProps> = ({ userData, onClose }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const toggleUser = (login: string) => {
    setSelectedUser(selectedUser === login ? null : login);
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
            <ModalUser key={index} onClick={() => toggleUser(user.avatar_url)}>
              <UserAvatar
                src={user.avatar_url}
                alt={user.login}
                isSelected={selectedUser === user.avatar_url}
              />
              <UserId>{user.login}</UserId>
              <UserId>{user.username}</UserId>
            </ModalUser>
          ))}
        </ModalUserGrid>
      )}
      {!userData.data && <p>사용자 데이터를 가져올 수 없습니다.</p>}
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

// UserAvatar 컴포넌트의 경우 `isSelected` 프로퍼티에 따라 조건부 스타일을 적용해야 합니다.
// tw-styled-components와 함께 조건부 로직을 사용하기 위해서는 아래와 같이 함수를 사용해야 합니다.
const UserAvatar = tw.img<UserAvatarProps>`
  w-full max-w-[100px] h-auto rounded-full border-2
  ${(props) => props.isSelected && css`border-blue-500`}
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
