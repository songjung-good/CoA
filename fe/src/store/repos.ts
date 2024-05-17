import { create } from "zustand";
import { getTotalLinesOfCode, Repository } from "@/api/userPage/apiLinesOfCode";
import { getGithubLOCData } from "@/api/userPage/apiLOC";

interface LanguageStats {
  [language: string]: number;
}

// Zustand store 생성
interface repositoryStore {
  repos: Repository[];
  languageTotals: LanguageStats;
  setRepos: (userName: string) => void;
  setRepos1: (uuid: string) => void;
}

const repositoryStore = create<repositoryStore>((set) => ({
  repos: [],
  languageTotals: {},
  setRepos1: async (uuid: string) => {
    try {
      const repos = await getGithubLOCData(uuid);
      let languageTotals: LanguageStats = {};
      if (repos !== undefined) {
        repos.forEach((repo) => {
          Object.entries(repo.languages).forEach(([language, lines]) => {
            if (languageTotals[language]) {
              languageTotals[language] += lines;
            } else {
              languageTotals[language] = lines;
            }
          });
        });

        set({ repos, languageTotals });
      }
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  },
  setRepos: async (userName: string) => {
    try {
      const repos = await getTotalLinesOfCode(userName);
      let languageTotals: LanguageStats = {};
      // console.log("repos");
      // console.log(repos);
      repos.forEach((repo) => {
        Object.entries(repo.languages).forEach(([language, lines]) => {
          if (languageTotals[language]) {
            languageTotals[language] += lines;
          } else {
            languageTotals[language] = lines;
          }
        });
      });

      set({ repos, languageTotals });
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  },
}));

export default repositoryStore;
