import { create, StateCreator  } from "zustand";
import { persist, createJSONStorage, PersistOptions  } from 'zustand/middleware'

// 분석 중이 아니면 분석% 및 완료 버튼 안보이게 하기 위해서
// isAnalyzing을 통해 false 일때는 Header에서 분석결과에 대한 정보 안보이게 하기 위함

interface AnalyzingState {
  isAnalyzing: boolean;  // true 일때 Header에 분석 정보 표시
  isCompleted: boolean;  // 둘다 true 일때 분석 결과 확인 버튼 보여주기 false라면 분석 진행도 보여주기
  analyzingPercent: number; // 0 ~ 100
  analyzeId: number; // -1 : 분석 X, 0 ~ : 분석Id
  startAnalysis: () => void;  // 분석 시작
  completeAnalysis: () => void; // 분석 완료
  resetAnalysis: () => void;  // 분석 결과 확인
}

// Next + Zustand + TypeScript + Persist 사용시 타입 에러 발생
// persist 타입을 추가로 지정해야 함
type analyzingPersist = (
  config: StateCreator<AnalyzingState>,
  options: PersistOptions<AnalyzingState>
) => StateCreator<AnalyzingState>

const useAnalyzingStore = create<AnalyzingState, []>(
  (persist as analyzingPersist)(
    (set) => ({
      isAnalyzing: false,
      isCompleted: false,
      analyzingPercent: 0,
      analyzeId: -1,

      startAnalysis: () => set({ isAnalyzing: true, isCompleted: false }), // 분석 시작
      completeAnalysis: () => set({ isAnalyzing: true, isCompleted: true }), // 분석 완료
      updatePercent: (percent: number) => set({ analyzingPercent: percent }), // 진행도 갱신
      resetAnalysis: () => set({ isAnalyzing: false, isCompleted: false, analyzingPercent: 0, analyzeId: -1 }), // 분석상태 초기화
    }),
    {
      name: 'analyzing-store',  // 스토어의 이름 (로컬 스토리지에서 이 이름으로 저장됩니다)
      storage: createJSONStorage(() => localStorage) // 스토리지를 localStorage로 설정
    }
  )
);

export default useAnalyzingStore;