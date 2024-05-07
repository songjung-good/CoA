// UserModal은 레포지토리의 기여자를 모달 형태로 보여주는 컴포넌트
import React, { useState } from 'react';
import styled from 'styled-components';

// 타입 정리
interface UserModalProps {
  userData: {
    data: User[];
    repositoryName: string;
  };
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

const UserModal: React.FC<UserModalProps> = ({ userData }) => {
  console.log(userData);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const toggleUser = (login: string) => {
    setSelectedUser(selectedUser === login ? null : login);
  };

  return (
    <ModalOverlay>
      <ModalContent>
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
      <ModalCloseButton onClick={() => setSelectedUser(null)}>
        X
      </ModalCloseButton>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 배경색 및 투명도 조절 */
  z-index: 4;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalCloseButton = styled.button`
  color: black;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
`;

const ModalUserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const ModalUser = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin: 10px;
`;

const UserAvatar = styled.img<AvatarProps>`
  width: 100%;
  max-width: 100px; /* 최대 너비 조절 */
  height: auto;
  border-radius: 50%;
  border: ${(props) => (props.isSelected ? '2px solid blue' : '2px solid transparent')};
`;

const UserId = styled.p`
  margin-top: 10px;
  max-width: 100px; /* 최대 너비 조절 */
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default UserModal;
