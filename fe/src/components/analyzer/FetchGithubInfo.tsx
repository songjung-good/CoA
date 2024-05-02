import axios from 'axios';
import { ExtractUserInfo } from './ExtractUserInfo';

const accessTokenHub = process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKENS;
const accessTokenLab = process.env.NEXT_PUBLIC_GITLAB_ACCESS_TOKENS;

interface Contributor {
  id: number;
  username: string;
  name: string;
  state: string;
  locked: boolean;
  avatar_url: string;
}

interface Project {
  id: number;
  description: string;
  name: string;
  path: string;
  path_with_namespace: string;
  last_activity_at: string;
  _links: {
    members: string;
  };
}

const FetchGithubInfo = async (inputValue: string, setUserData: Function) => {
  const githubInfo = ExtractUserInfo(inputValue);
  if (githubInfo.platform === '1') {
    await fetchGitHubData(githubInfo, setUserData, accessTokenHub);
  } else if (githubInfo.platform === '2') {
    await fetchGitLabData(githubInfo, setUserData, accessTokenLab);
  } else {
    console.log("유효한 GitHub URL을 입력하세요.");
  }
};

const fetchGitHubData = async (githubInfo: any, setUserData: Function, accessTokenHub: any) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${githubInfo.username}/${githubInfo.repositoryName}/contributors`,
      {
        headers: {
          Authorization: `Bearer ${accessTokenHub}`,
        },
      }
    );
    // GitHub repositoryName을 포함하여 데이터 설정
    setUserData({
      data: response.data,
      repositoryName: githubInfo.repositoryName
    });
  } catch (error) {
    console.error("GitHub 정보를 가져오는 데 실패했습니다.", error);
  }
};

const fetchGitLabData = async (githubInfo: any, setUserData: Function, accessTokenLab: any) => {
  try {
    const members = await fetchProjectMembers(githubInfo.repositoryName, accessTokenLab);
    // GitLab projectId를 반환 값에 포함
    setUserData({
      data: members,
      projectId: members.length > 0 ? members[0].id : null // 예시: 첫 번째 멤버의 ID를 projectId로 사용
    });
  } catch (error) {
    console.error("GitLab 정보를 가져오는 데 실패했습니다.", error);
  }
};

const fetchProjectMembers = async (projectName: string, accessToken: string): Promise<Contributor[]> => {
  try {
    // GitLab API를 사용하여 사용자가 기여한 프로젝트 정보를 가져오는 요청
    const projectsResponse = await axios.get(
      `https://lab.ssafy.com/api/v4/users/jed595/contributed_projects`, // 사용자 ID가 고정된 부분을 동적으로 처리해야 할 것 같습니다.
      {
        headers: {
          'PRIVATE-TOKEN': accessToken,
        },
      }
    );

    // 받아온 프로젝트 정보를 반복하여 프로젝트 이름이 일치하는 ID를 찾아냅니다.
    let projectId = '';
    projectsResponse.data.forEach((project: any) => {
      if (project.name === projectName) {
        projectId = project.id;
      }
    });

    // GitLab API를 사용하여 프로젝트 멤버 정보를 가져오는 요청
    const membersResponse = await axios.get(
      `https://lab.ssafy.com/api/v4/projects/${projectId}/members`,
      {
        headers: {
          'PRIVATE-TOKEN': accessToken,
        },
      }
    );

    // 프로젝트 멤버 정보 반환
    return membersResponse.data;
  } catch (error) {
    console.error('멤버 찾는데 실패하였습니다.:', error);
    throw error;
  }
};

export default FetchGithubInfo;
