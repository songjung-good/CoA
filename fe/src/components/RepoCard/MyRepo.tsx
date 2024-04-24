'use client'

import React, { useState, useEffect } from 'react';
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
    <div>
      <h2>Repositories for {userID}</h2>
      <ul>
        {repos.map(repo => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyRepo;
