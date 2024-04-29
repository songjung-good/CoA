import { create } from "zustand";
import { getTotalLinesOfCode, Repository } from "@/api/userPage/apiLinesOfCode";

// Zustand store 생성
interface repositoryStore {
  repos: Repository[];
  setRepos: (userName: string) => void;
}
const repositoryStore = create<repositoryStore>((set) => ({
  repos: [],
  setRepos: async (userName: string) => {
    try {
      const repos = await getTotalLinesOfCode(userName);
      set({ repos });
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  },
}));

export default repositoryStore;
