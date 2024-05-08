import { create } from "zustand";

interface UserStore {
  githubUserName: string;
  setGithubUserName: (input: string) => void;
  gitlabUserName: string;
  setGitlabUserName: (input: string) => void;
  AuthUserName: string;
  setAuthUserName: (input: string) => void;
  userImage: string;
  setUserImage: (input: string) => void;
  UUID: string;
  setUUID: (input: string) => void;
}

const userStore = create<UserStore>((set) => ({
  githubUserName: "Shin-3117",
  setGithubUserName: (input: string) => set({ githubUserName: input }),
  gitlabUserName: "qsc3117",
  setGitlabUserName: (input: string) => set({ gitlabUserName: input }),
  AuthUserName: "Shin-3117",
  setAuthUserName: (input: string) => set({ AuthUserName: input }),
  userImage: "/image/chun.png",
  setUserImage: (input: string) => set({ userImage: input }),
  UUID: "",
  setUUID: (input: string) => set({ UUID: input }),
}));

export default userStore;
