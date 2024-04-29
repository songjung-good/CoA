import axios from "axios";

interface LanguageStats {
  [language: string]: number;
}

export interface Repository {
  name: string;
  createdAt: string;
  pushedAt: string;
  updatedAt: string;
  languages: LanguageStats;
  totalLinesOfCode: number;
}

// GitHub 개인 액세스 토큰
const accessToken = process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKENS;

// GitHub GraphQL API 엔드포인트
const apiUrl: string = "https://api.github.com/graphql";

// GraphQL 요청을 보내는 함수  // GitHub 사용자 이름
async function sendGraphQLRequest(username: string): Promise<any> {
  if (accessToken === undefined) {
    console.log("accessToken Data가 undefined입니다.");
  }
  // GraphQL 쿼리
  const query = `
query {
    user(login: "${username}") {
        repositories(first: 100) {
            nodes {
                name
                createdAt
                pushedAt
                updatedAt
                languages(first: 10) {
                    edges {
                        node {
                            name
                        }
                        size
                    }
                }
            }
        }
    }
}
`;
  // console.log(accessToken);
  const response = await axios.post(
    apiUrl,
    { query },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  console.log(response);
  return response.data.data.user.repositories.nodes;
}

// 모든 저장소의 언어별 코드 줄 수를 가져오는 함수
export async function getTotalLinesOfCode(
  username: string,
): Promise<Repository[]> {
  try {
    const repos = await sendGraphQLRequest(username);
    let repositories: Repository[] = [];
    repos.forEach((repo: any) => {
      let totalLinesOfCode: number = 0;
      const repoLanguages: LanguageStats = {};

      repo.languages.edges.forEach((edge: any) => {
        const languageName = edge.node.name;
        const languageSize = edge.size;
        repoLanguages[languageName] = languageSize;
        totalLinesOfCode += languageSize;
      });

      repositories.push({
        name: repo.name,
        createdAt: repo.createdAt,
        pushedAt: repo.pushedAt,
        updatedAt: repo.updatedAt,
        languages: repoLanguages,
        totalLinesOfCode: totalLinesOfCode,
      });
    });
    console.log(repositories);
    return repositories;
  } catch (error) {
    console.error("Error fetching data from GitHub GraphQL API:", error);
    return [];
  }
}
