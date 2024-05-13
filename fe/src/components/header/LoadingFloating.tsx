"use client";

import useAnalyzingStore from "@/store/analyze";
import { useEffect, useState } from "react";

export default function LoadingFloating() {
  const [showFloating, setShowFloating] = useState(false);
  // Zustand 훅을 사용하여 상태 직접 구독
  const isAnalyzing = useAnalyzingStore((state) => state.isAnalyzing);
  const isCompleted = useAnalyzingStore((state) => state.isCompleted);
  const analyzingPercent = useAnalyzingStore((state) => state.analyzingPercent);

  return (
    <div>
      {isAnalyzing && (
        <div
          className={`fixed bottom-10 right-4 ${isCompleted ? "bg-green-100" : "bg-blue-100"} border-l-4 ${isCompleted ? "border-green-500" : "border-blue-500"} ${isCompleted ? "text-green-700" : "text-blue-800"} p-4 rounded-lg transition-colors duration-300`}
        >
          {isCompleted ? (
            <p>분석이 완료되었습니다.</p>
          ) : (
            <div className="flex">
              <img
                src="/image/LoadingSpinner.gif"
                alt="로딩 스피너"
                width={20}
                height={40}
              />
              <span className="ml-2">{`분석 중 : ${analyzingPercent}%`}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
