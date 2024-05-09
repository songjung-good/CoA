"use client";

import { usePathname, useRouter } from "next/navigation";
import useAnalyzingStore from "@/store/analyze";
import useResultStore from "@/store/result";

// 임시데이터
import dummy from "@/app/result/[id]/_data/Result_DTO.json";

export default function LoadingAnalyzing({ hasJWT }: { hasJWT: boolean }) {
  const router = useRouter();
  const {
    isAnalyzing,
    isCompleted,
    analyzingPercent,
    analyzeId,
    startAnalysis,
    completeAnalysis,
    resetAnalysis,
  } = useAnalyzingStore((state) => state);

  const handleCompletedButton = async () => {
    // axios 분석 결과 받아오기
    // result store에 저장
    // 페이지 이동
    // 임시
    await useResultStore.getState().updateResultState(dummy);
    await useAnalyzingStore.getState().setAnalyzeId(1);
    // await console.log(useResultStore.getState().result);
    if (router) {
      await router.push(`/result/${analyzeId}`);
    }
    // 임시
    // console.log(dummy);
  };

  return (
    hasJWT && (
      <div>
        {/* 테스트 버튼(상태 변경용) */}
        <button onClick={startAnalysis}>분석 시작</button>
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
