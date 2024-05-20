"use client";

import useAnalyzingStore from "@/store/analyze";
import { useEffect, useState } from "react";

// 로딩 플로팅 컴포넌트 정의
export default function LoadingFloating({ hasJWT }: { hasJWT: boolean }) {
  const [showFloating, setShowFloating] = useState(false);

  // Zustand 훅을 사용하여 상태 직접 구독
  const isAnalyzing = useAnalyzingStore((state) => state.isAnalyzing);
  const isCompleted = useAnalyzingStore((state) => state.isCompleted);
  const analyzingPercent = useAnalyzingStore((state) => state.analyzingPercent);

  return (
    <div>
      {hasJWT && (
        <div>
          {isAnalyzing && (
            <div
              className={`fixed bottom-10 right-4 ${
                isCompleted
                  ? "bg-green-100 border-green-500 text-green-700"
                  : analyzingPercent === undefined
                    ? "bg-red-100 border-red-500 text-red-800"
                    : "bg-blue-100 border-blue-500 text-blue-800"
              } border-l-4 p-4 rounded-lg transition-colors duration-300`}
            >
              {isCompleted ? (
                <p>분석이 완료되었습니다.</p>
              ) : (
                <div className="flex">
                  {analyzingPercent !== undefined && (
                    <img
                      src="/image/LoadingSpinner.gif"
                      alt="로딩 스피너"
                      width={20}
                      height={40}
                    />
                  )}
                  <span className="ml-2">
                    {analyzingPercent === undefined
                      ? "분석에 실패했습니다."
                      : `분석 중 : ${analyzingPercent}%`}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
