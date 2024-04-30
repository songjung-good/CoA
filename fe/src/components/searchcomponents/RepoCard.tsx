import React from 'react';

interface CardProps {
  type: 'repo' | 'user';
  data: any; // 데이터 형식에 따라 수정 필요
}

const RepoCard: React.FC<CardProps> = ({ type, data }) => {
  // type에 따라 다른 내용을 표시
  if (type === 'repo') {
    return (
      <div>
        <h3>{data.name}</h3> 
        <p>{data.description}</p> 
        {/* ... 레포지토리 관련 정보 ... */}
      </div>
    );
  } else if (type === 'user') {
    return (
      <div>
        <img src={data.avatar_url} alt={data.login} /> 
        <h3>{data.login}</h3> 
        {/* ... 사용자 관련 정보 ... */}
      </div>
    );
  }

  return null; 
};

export default RepoCard;