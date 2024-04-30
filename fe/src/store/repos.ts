import { create } from "zustand";
import { getTotalLinesOfCode, Repository } from "@/api/userPage/apiLinesOfCode";

interface LanguageStats {
  [language: string]: number;
}

// Zustand store 생성
interface repositoryStore {
  repos: Repository[];
  languageTotals: LanguageStats;
  setRepos: (userName: string) => void;
}

const repositoryStore = create<repositoryStore>((set) => ({
  repos: [],
  languageTotals: {},
  setRepos: async (userName: string) => {
    try {
      const repos = await getTotalLinesOfCode(userName);
      let languageTotals: LanguageStats = {};

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
