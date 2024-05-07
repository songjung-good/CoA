import { create } from "zustand";

interface UserStore {
  githubUserName: string;
  setGithubUserName: (input: string) => void;
}

const userStore = create<UserStore>((set) => ({
  githubUserName: "Shin-3117",
  setGithubUserName: (input: string) => set({ githubUserName: input }),
}));

export default userStore;
