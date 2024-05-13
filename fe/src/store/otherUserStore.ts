import { create } from "zustand";

interface Skill {
  codeId: number;
  codeName: string;
}

interface OtherUserStore {
  memberUuid: string;
  memberNickName: string | null;
  memberImg: string;
  memberIntro: string;
  skillList: Skill[];
  memberJobCodeId: number;
  isMine: boolean;
  isBookmark: boolean;
}

const otherUserStore = create<OtherUserStore>((set) => ({
  memberUuid: "",
  memberNickName: null,
  memberImg: "/image/LoadingSpinner.gif",
  memberIntro: "",
  skillList: [],
  memberJobCodeId: 2004,
  isMine: false,
  isBookmark: false,
}));

export default otherUserStore;
