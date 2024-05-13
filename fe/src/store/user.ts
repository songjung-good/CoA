import { create } from "zustand";

interface UserStore {
  UUID: string;
  userImage: string;
  githubUserName: string | null;
  isGithubToken: boolean | null;
  gitlabUserName: string | null;
  isGitlabToken: boolean | null;
  AuthUserName: string | null;
  solvedacNickName: string | null;
  codeforcesNickName: string | null;
  // setUUID: (input: string) => void;
  // setUserImage: (input: string) => void;
  // setAuthUserName: (input: string) => void;
  // setGithubUserName: (input: string) => void;
  // setGitlabUserName: (input: string) => void;
  // setIsGithubToken: (input: boolean) => void;
  // setIsGitlabToken: (input: boolean) => void;
  // setSolvedacNickName: (input: string) => void; // 추가
  // setCodeforcesNickName: (input: string) => void; // 추가
}

const userStore = create<UserStore>((set) => ({
  UUID: "",
  userImage: "/image/LoadingSpinner.gif",
  AuthUserName: "",
  githubUserName: null,
  isGithubToken: null,
  gitlabUserName: null,
  isGitlabToken: null,
  solvedacNickName: null,
  codeforcesNickName: null,
  // setUUID: (input: string) => set({ UUID: input }),
  // setUserImage: (input: string) => set({ userImage: input }),
  // setAuthUserName: (input: string) => set({ AuthUserName: input }),
  // setGithubUserName: (input: string) => set({ githubUserName: input }),
  // setIsGithubToken: (input: boolean) => set({ isGithubToken: input }),
  // setGitlabUserName: (input: string) => set({ gitlabUserName: input }),
  // setIsGitlabToken: (input: boolean) => set({ isGitlabToken: input }),
  // setSolvedacNickName: (input: string) => set({ solvedacNickName: input }), // 추가
  // setCodeforcesNickName: (input: string) => set({ codeforcesNickName: input }),
}));

export default userStore;
