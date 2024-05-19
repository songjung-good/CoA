"use client";
import React, { useState } from "react";
import Link from "next/link";
import tw from "tailwind-styled-components";

interface ListItemIconProps {
  checked: boolean;
}

const GitHubTokenPage = () => {
  const [checkedItems, setCheckedItems] = useState(Array(8).fill(false)); // 8개의 체크박스 상태를 관리하는 상태

  const handleCheckChange = (index: number) => {
    setCheckedItems((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <Section>
      <Container>
        <TextCenter>
          <SmallText>Token Registration</SmallText>
          <Title>Github 액세스 토큰을 받는 8가지 스텝</Title>
          <Subtitle>
            아래의 순서에 따라 당신의 액세스 토큰을 발급 받아보세요.
          </Subtitle>
          <Link
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AccessButton>
              해당 버튼을 누르면 step4의 페이지로 이동합니다.
            </AccessButton>
          </Link>
        </TextCenter>
        <List>
          {[
            "GitHub에 로그인하고 프로필 아이콘을 클릭한 후, Settings를 선택합니다.",
            "좌측 메뉴에서 Developer settings를 클릭합니다.",
            "좌측 메뉴 중 Personal access tokens에서 Tokens(classic)를 클릭합니다.",
            "Generate new token 버튼을 클릭하고 classic 토큰을 선택합니다.",
            "Note 란에 토큰 이름을 작성합니다. (예: GitHub_Access_Token)",
            "Expiration 기한을 선택합니다. (No expiration을 권장)",
            "아래 Scope 섹션에서 repo 체크박스를 필수로 선택합니다.",
            "Generate token 버튼을 클릭하여 토큰을 생성합니다.",
          ].map((step, index) => (
            <ListItem key={index} onClick={() => handleCheckChange(index)}>
              <ListItemIcon checked={checkedItems[index]}>
                {/* SVG can be replaced with relevant icons for each step */}
              </ListItemIcon>
              <ListItemText>
                <ListItemTitle>{`Step ${index + 1}`}</ListItemTitle>
                <ListItemDescription>{step}</ListItemDescription>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Container>
    </Section>
  );
};

const Section = tw.section`
  py-12
  sm:py-16
  lg:py-20
  xl:py-24
`;

const Container = tw.div`
  mx-auto
  max-w-7xl
  px-4
  sm:px-6
  lg:px-8
`;

const TextCenter = tw.div`
  text-center
`;

const SmallText = tw.p`
  text-sm
  font-bold
  uppercase
  tracking-widest
  text-gray-700
`;

const Title = tw.h2`
  mt-6
  text-3xl
  font-bold
  tracking-tight
  text-gray-900
  sm:text-4xl
  lg:text-5xl
`;

const Subtitle = tw.p`
  mx-auto
  my-4
  max-w-2xl
  text-lg
  font-normal
  text-gray-700
  lg:text-xl
  lg:leading-8
`;

const List = tw.ul`
  mx-auto
  mt-12
  grid
  max-w-md
  grid-cols-1
  gap-10
  sm:mt-16
  lg:mt-20
  lg:max-w-5xl
  lg:grid-cols-4
`;

const ListItem = tw.li`
  flex-start
  group
  relative
  flex
  lg:flex-col
`;

const ListItemIcon = tw.div<ListItemIconProps>`
  inline-flex
  h-10
  w-10
  shrink-0
  items-center
  justify-center
  rounded-xl
  border
  border-gray-300
  bg-gray-50
  transition-all
  duration-200
  group-hover:border-gray-900
  group-hover:bg-gray-900
  ${(props) => props.checked && "bg-gray-900 border-gray-900"}
`;

const ListItemText = tw.div`
  ml-6
  lg:ml-0
  lg:mt-10
`;

const ListItemTitle = tw.h3`
  text-xl
  font-bold
  text-gray-900
`;

const ListItemDescription = tw.h4`
  mt-2
  text-base
  text-gray-700
`;

const AccessButton = tw.button`
  inline-flex
  items-center
  justify-center
  py-2
  px-3
  border-1-black
  border
  text-base
  font-medium
  rounded-md
  text-white
  bg-black
  hover:bg-opacity-75
`;

export default GitHubTokenPage;
