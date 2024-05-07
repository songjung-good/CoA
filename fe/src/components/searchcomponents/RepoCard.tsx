import React from 'react';

interface RepoCardProps {
  data: {
    memberId: number;
    memberNickName: string;
    memberImg: string;
    repoViewId: number;
    repoViewTitle: string;
    repoViewSubTitle: string;
    skillList: string[];
    dateRange: { startDate: string; endDate: string };
    isMine: boolean;
  };
}

const RepoCard: React.FC<RepoCardProps> = ({ data }) => {
  const { memberNickName, memberImg, repoViewTitle, repoViewSubTitle, skillList } = data;

  return (
    <div className="card">
      <div className="avatar-container">
        <img src={memberImg} alt={memberNickName} className="avatar" /> 
        <div className="info">
          <p className="name">{memberNickName}</p>
          <p className="title">{repoViewTitle}</p>
          <p className="subtitle">{repoViewSubTitle}</p>
        </div>
      </div>
      <div className="skills-container">
        <p className="skills-label">기술   스택:</p>
        {skillList.map((skill) => (
          <span key={skill} className="skill">{skill}</span>
        ))}
      </div>
    </div>
  );
};

export default RepoCard;