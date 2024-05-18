'use client';
import React, { useState } from 'react';
import tw from 'tailwind-styled-components';

import GitHubTokenPage from '@/app/info/component/GitHubTokenPage';
import GitLabTokenPage from '@/app/info/component/GitLabTokenPage';

const InpoPage = () => {
  const [page, setPage] = useState(0); // 0: GitHubTokenPage, 1: GitLabTokenPage

  const handlePageChange = (newPage:number) => {
    setPage(newPage);
  };

  return (
    <Main>
      {page === 0 ? <GitHubTokenPage /> : <GitLabTokenPage />}
      <ButtonGroup>
        <Button onClick={() => handlePageChange(0)}>GitHub Token Page</Button>
        <Button onClick={() => handlePageChange(1)}>GitLab Token Page</Button>
      </ButtonGroup>
    </Main>
  );
};

const Main = tw.main`
  flex
  flex-col
  justify-center
`;

const ButtonGroup = tw.div`
  flex
  justify-center
  gap-4
`;

const Button = tw.button`
  px-4
  py-2
  text-white
  bg-blue-500
  rounded
  hover:bg-blue-700
  focus:outline-none
  focus:ring
  focus:ring-blue-300
  focus:ring-opacity-50
`;

export default InpoPage;