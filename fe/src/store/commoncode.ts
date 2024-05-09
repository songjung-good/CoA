import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware'

interface Code {
  [key: string]: string;
}

interface CodeType {
  typeId: string | null;
  typeName: string | null;
  codes: Code | null;
}

interface ApiResponse {
  isSuccess: boolean;
  message: string;
  code: number;
  result: {  
    commonCodeList: CodeType[];
  };
}

interface CommonCodeState {
  response: ApiResponse;
  setResponse: (response: ApiResponse) => void;
}

type commonPersist = (
  config: StateCreator<CommonCodeState>,
  options?: PersistOptions<CommonCodeState>
) => StateCreator<CommonCodeState>

const useCommonCodeStore = create<CommonCodeState>((persist as commonPersist)(
  (set) => ({
    response: {
      isSuccess: false,
      message: '',
      code: 0,
      result: { commonCodeList: [] } 
    },
    setResponse: (response) => set({ response })
  }),
  {
    name: 'common-code-store',
    storage: createJSONStorage(() => localStorage)
  }
));

export default useCommonCodeStore;
