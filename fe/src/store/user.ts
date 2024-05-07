import { create } from "zustand";

interface UserStore {
  githubUserName: string;
  setGithubUserName: (input: string) => void;
  gitlabUserName: string;
  setGitlabUserName: (input: string) => void;
  AuthUserName: string;
  setAuthUserName: (input: string) => void;
}

const userStore = create<UserStore>((set) => ({
  githubUserName: "Shin-3117",
  setGithubUserName: (input: string) => set({ githubUserName: input }),
  gitlabUserName: "qsc3117",
  setGitlabUserName: (input: string) => set({ gitlabUserName: input }),
  AuthUserName: "auth username",
  setAuthUserName: (input: string) => set({ AuthUserName: input }),
}));

export default userStore;
