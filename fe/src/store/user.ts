import { create } from "zustand";

interface UserStore {
  userName: string;
  setUserName: (input: string) => void;
  gitlabName: string;
  setgitlabName: (input: string) => void;
}

const userStore = create<UserStore>((set) => ({
  userName: "Shin-3117",
  setUserName: (input: string) => set({ userName: input }),
  gitlabName: "jed595",
  setgitlabName: (input: string) => set({ gitlabName: input }),
}));

export default userStore;
