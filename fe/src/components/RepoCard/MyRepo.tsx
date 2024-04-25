'use client'

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface Repo {
  id: number;
  name: string;
  html_url: string;
}

interface MyRepoProps {
  userID: string;
}

const MyRepo: React.FC<MyRepoProps> = ({ userID }) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get(`https://api.github.com/users/${userID}/repos`);
        setRepos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching repos:', error);
      }
    };

    fetchRepos();

    return () => {
      // Cleanup
    };
  }, [userID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <RepoList>
      {repos.map(repo => (
        <RepoItem key={repo.id}>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
        </RepoItem>
      ))}
    </RepoList>
  );
};

const RepoList = styled.ul`
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 30px;
`;

const RepoItem = styled.li`
  border: 1px solid #ccc;
  margin-top: 10px;
  margin-right: 10px;
  padding: 10px;
`;

export default MyRepo;
