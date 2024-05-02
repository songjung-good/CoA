export const ExtractUserInfo = (url: string) => {
  let domain = '';
  let projectGroup = '';
  let projectName = '';
  let platform = '';
  let username = '';

  // GitHub URL 패턴
  const gitHubRegex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
  const gitHubMatch = url.match(gitHubRegex);

  // GitLab URL 패턴
  const gitLabRegex = /https:\/\/([^\/]+)\/([^\/]+)\/([^\/]+)/;
  const gitLabMatch = url.match(gitLabRegex);

  if (gitHubMatch) {
    // GitHub 도메인인 경우
    domain = 'github';
    username = gitHubMatch[1];
    projectName = gitHubMatch[2];
    platform = '1'; // GitHub 플랫폼을 나타내는 코드
  } else if (gitLabMatch) {
    // GitLab 도메인인 경우
    domain = 'gitlab';
    projectGroup = gitLabMatch[2];
    projectName = gitLabMatch[3];
    platform = '2'; // GitLab 플랫폼을 나타내는 코드
    username = 'jed595'; // GitLab의 경우 임시로 'jed595' 사용
  } else {
    // GitHub나 GitLab 도메인이 아닌 경우
    return { username: null, repositoryName: null, platform: null };
  }

  // username은 사용자 정보를 통해 가져올 값이라 임의의 값
  return { username, repositoryName: projectName, platform };
};
