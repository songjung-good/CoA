"use client";

import { usePathname, useRouter } from "next/navigation";
import useAnalyzingStore from "@/store/analyze";
import useResultStore from "@/store/result";
import UseAxios from "@/api/common/useAxios";

// 임시데이터
import dummy from "@/app/result/[id]/_data/Result_DTO.json";

export default function LoadingAnalyzing({ hasJWT }: { hasJWT: boolean }) {
  const axios = UseAxios();
  const router = useRouter();
  const {
    isAnalyzing,
    isCompleted,
    analyzingPercent,
    analyzeId,
    startAnalysis,
    completeAnalysis,
    resetAnalysis,
    setAnalyzeId,
  } = useAnalyzingStore((state) => state);

  const { updateResultState } = useResultStore.getState();

  const handleCompletedButton = async () => {
    // axios 분석 결과 받아오기

    // 임시
    axios
      .get(`/api/repos/analysis/done/${analyzeId}`)
      .then((res) => {
        updateResultState(res.data); // 분석 결과 데이터 저장
        console.log(res);
      })
      .then((res) => {
        resetAnalysis; // 분석 상태 초기화
      });
    // result store에 저장
    // 페이지 이동
    // 임시
    // await useResultStore.getState().updateResultState(dummy);
    // await useAnalyzingStore
    //   .getState()
    //   .setAnalyzeId("49af5a7e-2cdf-452d-b558-2156e7e87e3a");
    await useAnalyzingStore.getState().resetAnalysis();
    // await console.log(useResultStore.getState().result);
    if (router) {
      await router.push(`/result/${analyzeId}`);
    }
    // 임시
    // console.log(dummy);
  };

  const handleStartAnalyze = async () => {
    await setAnalyzeId("0bd05a23-610b-48a5-9729-a098d65688aa");
    await startAnalysis();
  };

  return (
    hasJWT && (
      <div>
        {/* 테스트 버튼(상태 변경용) */}
        <button onClick={handleStartAnalyze}>분석 시작</button>
        <button onClick={completeAnalysis}>분석 종료</button>
        <button onClick={resetAnalysis}>초기화</button>
        {/* 테스트 버튼(상태 변경용) */}
        {isAnalyzing && (
          <div className="flex justify-center items-center">
            {isCompleted ? (
              <div>
                <button
                  className="p-1 bg-appPink text-white rounded-lg"
                  onClick={handleCompletedButton}
                >
                  분석 결과 확인
                </button>
              </div>
            ) : (
              <span className="flex justify-center items-center">
                <img
                  src="/image/LoadingSpinner.gif"
                  alt="로딩스피너"
                  width={20}
                  height={40}
                />
                <p className="ml-2">분석중 : {analyzingPercent}%</p>
              </span>
            )}
          </div>
        )}
      </div>
    )
  );
}
