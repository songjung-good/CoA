// GitHub 또는 GitLab API를 사용하여 사용자 정보를 가져오는 함수

// 컴포넌트
import { ExtractUserInfo } from '@/app/main/analyzer/ExtractUserInfo';
import UseAxios from '@/api/common/useAxios';
import { error } from 'console';

interface Contributor {
  projectId: number;
  username: string;
  name: string;
  state: string;
  locked: boolean;
  avatar_url: string;
}

// GitHub인지 GitLab인지 판단하여 정보 요청
const FetchGitInfo = async (inputValue: string, setUserData: Function) => {

  let gitInfo = ExtractUserInfo(inputValue);

  if (gitInfo.Platform === '1') {
    await fetchGitHubData(gitInfo, setUserData);
  } else if (gitInfo.Platform === '2') {
    gitInfo = { ...gitInfo, setUserData};
    await fetchGitLabData(gitInfo, setUserData);
  } else {
    console.log("유효한 GitHub URL을 입력하세요.");
  }
};

// Github프로젝트의 기여자 정보
const fetchGitHubData = async (gitInfo: any, setUserData: Function) => {
  const axios = UseAxios();

  try {
    const response = await axios.get(`/api/external/github/members/${gitInfo.UserName}/${gitInfo.ProjectName}`)
    if (response.data.code === 602) {
      throw alert("GitHub 계정을 연동해주세요.")
    }
    if (response.data.code === 303) {
      throw alert("본인 여부(접근 권한) 및 토큰을 확인해주세요.")
    }

    setUserData({
      data: JSON.parse(response.data.result)
    });

  } catch (error) {
    console.error("GitHub 정보를 가져오는 데 실패했습니다.", error);
  }
};

// GitLab 프로젝트의 기여자 정보와 프로젝트 ID
const fetchGitLabData = async (gitInfo: any, setUserData: Function) => {

  try {
    const members = await fetchGitlabMembers(gitInfo.ProjectName, gitInfo.UserName);

    // GitLab projectId를 반환 값에 포함
    setUserData({
      data: members,
      projectId: members.length > 0 ? members[0].projectId : null
    });
  } catch (error) {
    console.error("GitLab 정보를 가져오는 데 실패했습니다.", error);
  }
};

// GitLab 프로젝트 멤버 정보
const fetchGitlabMembers = async (projectname: string, username: string): Promise<Contributor[]> => {
  const axios = UseAxios();
  try {
    const projectsResponse = await axios.get(`/api/external/gitlab/projects/${projectname}`)

    if (projectsResponse.data.code === 602) {
      throw alert("GitLab 계정을 연동해주세요.")
    }
    if (projectsResponse.data.code === 303) {
      throw alert("본인 여부(접근 권한) 및 토큰을 확인해주세요.")
    }

    if (projectsResponse.data.code === 803) {
      throw alert(projectsResponse.data.message)
    }
    return JSON.parse(projectsResponse.data.result);

  } catch (error) {
    console.error('멤버 찾는데 실패하였습니다. : ', error);
    throw error;
  }
};

export default FetchGitInfo;
