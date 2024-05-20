import axios from "axios";

export interface LanguageStats {
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
    // console.log("accessToken Data가 undefined입니다.");
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
                isFork
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
  return response.data.data.user.repositories.nodes.filter(
    (repo: any) => !repo.isFork,
  );
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
    //결과값 정렬 생성일자가 최신인거 우선
    repositories.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    //언어 내림차순 정렬
    repositories.forEach((repo) => {
      const sortedLanguages = Object.entries(repo.languages)
        .sort((a, b) => b[1] - a[1])
        .reduce((obj, [key, val]) => {
          obj[key] = val;
          return obj;
        }, {} as LanguageStats);

      repo.languages = sortedLanguages;
    });

    // console.log(repositories);
    return repositories;
  } catch (error) {
    console.error("getTotalLinesOfCode 에러:", error);
    return [];
  }
}
