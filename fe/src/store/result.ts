import { create, StateCreator  } from "zustand";
import { persist, createJSONStorage, PersistOptions  } from 'zustand/middleware'


interface ResultState {
  isOwn: boolean
  setIsOwn: () => void;
  setIsOther: () => void;
}

type resultPersist = (
  config: StateCreator<ResultState>,
  options: PersistOptions<ResultState>
) => StateCreator<ResultState>

const useResultStore = create<ResultState, []>(
  (persist as resultPersist)(
    (set) => ({
      isOwn: false,

      setIsOwn: () => set({ isOwn: true }),
      setIsOther: () => set({ isOwn: false }),
    }),
    {
      name: 'result-store',  
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useResultStore;