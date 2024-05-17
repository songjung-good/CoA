'use client';

import React from 'react';
import tw from 'tailwind-styled-components';

const ErrorSection = tw.section`
  flex 
  justify-center
  items-center 
  h-screen 
  p-4 
  bg-white
`;

const Container = tw.div`
  flex 
  flex-col 
  items-center
`;

const ErrorText = tw.h2`
  text-9xl 
  font-extrabold 
  text-gray-500
`;

const Description = tw.p`
  text-5xl 
  text-black
  mt-4
`;

const HoverText = tw.span`
  cursor-pointer 
  hover:text-purple-600
`;

const BackButton = tw.a`
  inline-block 
  py-5
  px-10
  text-2xl
  font-semibold 
  text-white 
  bg-purple-600 
  rounded 
  no-underline
  transition-all
  hover:bg-purple-700
  mt-4
`;

const ErrorPage = () => {
  return (
    <ErrorSection>
      <Container>
        <ErrorText><HoverText>{`< SORRY />`}</HoverText></ErrorText>
        <Description>
          {`죄송합니다.`}<HoverText>{`<br />`}</HoverText> {`서버에 예상치 못한 `} <HoverText>오류</HoverText>{`가 발생했습니다`}
        </Description>
        <BackButton href="/">{`< Back to home />`}</BackButton>
      </Container>
    </ErrorSection>
  );
};

export default ErrorPage;