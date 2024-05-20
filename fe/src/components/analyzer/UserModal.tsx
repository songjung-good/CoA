import React, { useState } from "react";
import styled from "styled-components";

interface UserModalProps {
  userData: {
    login: string;
    avatar_url: string;
  }[];
}

interface AvatarProps {
  isSelected?: boolean;
}

const UserModal: React.FC<UserModalProps> = ({ userData }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const toggleUser = (login: string) => {
    setSelectedUser(selectedUser === login ? null : login);
    // console.log(selectedUser)
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalUserGrid>
          {userData.map((user, index) => (
            <ModalUser key={index} onClick={() => toggleUser(user.login)}>
              <UserAvatar
                src={user.avatar_url}
                alt={user.login}
                isSelected={selectedUser === user.login}
              />
              <UserId>{user.login}</UserId>
            </ModalUser>
          ))}
        </ModalUserGrid>
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
`;

const UserAvatar = styled.img<AvatarProps>`
  width: 100%;
  max-width: 100px; /* 최대 너비 조절 */
  height: auto;
  border-radius: 50%;
  border: ${(props) =>
    props.isSelected ? "2px solid blue" : "2px solid transparent"};
`;

const UserId = styled.p`
  margin-top: 10px;
  text-align: center;
`;

export default UserModal;
