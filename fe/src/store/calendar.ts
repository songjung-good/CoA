import { create } from "zustand";

import {
  ApiResponse,
  getGithubEventsData,
  getGitlabEventsData,
} from "@/api/userPage/apiContributions";
import mergeCalendarData from "@/app/user/[id]/_components/mergeEvents";

// Zustand store 생성
interface CalendarStore {
  githubData: ApiResponse | null;
  gitlabData: ApiResponse | null;
  mergeData: ApiResponse | null;
  fetchData1: (uuid: string) => void;
  category: number;
  setCategory: (num: number) => void;
}
const calendarStore = create<CalendarStore>((set) => ({
  githubData: null,
  gitlabData: null,
  mergeData: null,
  category: 3,
  fetchData1: async (uuid: string) => {
    const res1 = await getGithubEventsData(uuid);
    const res2 = await getGitlabEventsData(uuid);
    const res3 = mergeCalendarData(res1, res2);
    set({ githubData: res1 });
    set({ gitlabData: res2 });

    if (res3 !== null) {
      set({ mergeData: res3 });
    } else {
      set({ mergeData: null });
    }

    set({ category: 2 });
  },
  setCategory: (num) => {
    set({ category: num });
  },
}));

export default calendarStore;
