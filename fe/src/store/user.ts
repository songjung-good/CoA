import { create } from "zustand";

interface UserStore {
  userName: string;
  setUserName: (input: string) => void;
}

const userStore = create<UserStore>((set) => ({
  userName: "Shin-3117",
  setUserName: (input: string) => set({ userName: input }),
}));

export default userStore;
