import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Repo {
  id: number;
  name: string;
  html_url: string;
  isAnalyzed: boolean; // 분석 여부를 나타내는 필드 추가
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
    <ul className="flex justify-center flex-wrap list-none p-30">
      {repos.map((repo) => (
        <li key={repo.id} className="border-1 border-appYellow m-1 p-2 relative flex justify-center items-center flex-col transition duration-300 hover:shadow-md" //onMouseEnter={() => console.log('Mouse Enter')} onMouseLeave={() => console.log('Mouse Leave')}
        >
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            {repo.name}
          </a>
          <div className="buttons absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 invisible transition-all duration-300 flex gap-2">
            <button className="bg-blue-500 text-white font-bold py-1 px-2 text-sm rounded">분석하기</button>
            {repo.isAnalyzed && (
              <button className="bg-green-500 text-white font-bold py-1 px-2 text-sm rounded">상세보기</button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MyRepo;
