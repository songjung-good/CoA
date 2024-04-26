import axios from "axios";

interface LanguageStats {
  [language: string]: number;
}

interface Repository {
  name: string;
  languages_url: string;
}

// GitHub 사용자 이름
const username: string = "Shin-3117";

// GitHub API 엔드포인트
const apiUrl: string = `https://api.github.com/users/${username}/repos`;

// 사용자의 저장소 목록을 가져오는 함수
export async function getUserRepos(): Promise<Repository[]> {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching user repositories:", error);
    return [];
  }
}

// 저장소의 언어별 코드 줄 수를 가져오는 함수
export async function getRepoLanguages(repo: Repository): Promise<LanguageStats> {
  const languagesUrl: string = repo.languages_url;
  try {
    const response = await axios.get(languagesUrl);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching languages for repository ${repo.name}:`,
      error,
    );
    return {};
  }
}

// 모든 저장소의 언어별 코드 줄 수를 합산하는 함수
export async function getTotalLinesOfCode(): Promise<LanguageStats> {
  const repos: Repository[] = await getUserRepos();
  let totalLinesOfCode: LanguageStats = {};

  for (const repo of repos) {
    const languages: LanguageStats = await getRepoLanguages(repo);
    for (const [language, lines] of Object.entries(languages)) {
      totalLinesOfCode[language] = (totalLinesOfCode[language] || 0) + lines;
    }
  }

  return totalLinesOfCode;
}
