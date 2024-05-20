import userStore from "@/store/user";

// type 지정
interface UserInfo {
  UserName: string | null;
  ProjectName: string | null;
  Platform: string | null;
  setUserData?: Function;
}

export const ExtractUserInfo = ( url: string ): UserInfo => {
  // GitHub URL 패턴
  const gitHubRegex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
  const gitHubMatch = url.match(gitHubRegex);

  // GitLab URL 패턴
  const gitLabRegex = /https:\/\/([^\/]+)\/([^\/]+)\/([^\/]+)/;
  const gitLabMatch = url.match(gitLabRegex);
  // const gitlabname = userStore.getState().gitlabUserName;

  let UserName: string | null = null;
  let ProjectName: string | null = null;
  let Platform: string | null = null;

  if (gitHubMatch) {
    UserName = gitHubMatch[1];
    ProjectName = gitHubMatch[2];
    Platform = '1';
  } else if (gitLabMatch) {
    // UserName = gitlabname;
    ProjectName = gitLabMatch[3];
    Platform = '2'
  } else {
    // GitHub나 GitLab 도메인이 아닌 경우
    return { UserName: null, ProjectName: null, Platform: null };
  }

  return {
    UserName,
    ProjectName, 
    Platform 
  };
};
