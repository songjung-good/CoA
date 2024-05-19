import { create, StateCreator  } from "zustand";
import { persist, createJSONStorage, PersistOptions  } from 'zustand/middleware'
import UseAxios from "@/api/common/useAxios";
// 분석 중이 아니면 분석% 및 완료 버튼 안보이게 하기 위해서
// isAnalyzing을 통해 false 일때는 Header에서 분석결과에 대한 정보 안보이게 하기 위함


interface AnalyzingState {
  isAnalyzing: boolean;  // true 일때 Header에 분석 정보 표시
  isCompleted: boolean;  // 둘다 true 일때 분석 결과 확인 버튼 보여주기 false라면 분석 진행도 보여주기
  analyzingPercent: number; // 0 ~ 100
  analyzeId: string; // -1 : 분석 X, 0 ~ : 분석Id
  showNotification: boolean;  // 알림 표시 상태
  startAnalysis: () => void;  // 분석 시작
  completeAnalysis: () => void; // 분석 완료
  setAnalyzeId: (id: string) => void; // 분석ID 저장
  updatePercent: (percent: number) => void;
  resetAnalysis: () => void;  // 분석 결과 확인
  toggleNotification: (visible: boolean) => void;

  feachApi: () => void; // 분석 api 요청
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
      analyzeId: "none",
      showNotification: false,  // 초기 알림 상태는 숨김

      startAnalysis: () => set({ isAnalyzing: true, isCompleted: false }), // 분석 시작
      completeAnalysis: () => {
        set({ isAnalyzing: true, isCompleted: true });
        set({ showNotification: true });  // 분석 완료 시 알림 표시
      }, // 분석 완료
      setAnalyzeId: (id: string) => set({analyzeId: id}),
      updatePercent: (percent: number) => set({ analyzingPercent: percent }), // 진행도 갱신
      resetAnalysis: () => set({ isAnalyzing: false, isCompleted: false, showNotification: false, analyzingPercent: 0}), // 분석상태 초기화
      toggleNotification: (visible: boolean) => set({ showNotification: visible }),
      // 실사용 api
      feachApi: () => {
        // 분석 중인지 확인
        if (useAnalyzingStore.getState().isAnalyzing) {
          const axios = UseAxios();
          const analysisId = useAnalyzingStore.getState().analyzeId;
          // 서버에 현재 분석 상태를 요청
          axios.get(`/api/repos/analysis/${analysisId}`).then((res) => {
            const newPercent = res.data.result?.percentage;  // 서버로부터 받은 진행도
            set({ analyzingPercent: newPercent });  // 상태 업데이트
            // console.log(res.data)
            // console.log(analysisId)
            // 진행도가 100%에 도달했을 경우 분석을 완료합니다.
            if (newPercent >= 100) {
              set({ isCompleted: true, showNotification: true });
              // console.log("분석 완료");
            }
          }).catch(error => {
            console.error('분석 상태 업데이트 실패:', error);
            
            // 에러 처리 로직 필요
          });
        }
      }
    }),
    {
      name: 'analyzing-store',  // 스토어의 이름 (로컬 스토리지에서 이 이름으로 저장됩니다)
      storage: createJSONStorage(() => localStorage) // 스토리지를 localStorage로 설정
    }
  )
);

export default useAnalyzingStore;