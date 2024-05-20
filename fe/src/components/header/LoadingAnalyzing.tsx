"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useAnalyzingStore from "@/store/analyze";
import useResultStore from "@/store/result";
import UseAxios from "@/api/common/useAxios";
import "./header.css";

export default function LoadingAnalyzing({ hasJWT }: { hasJWT: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
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
        // console.log(res);
      })
      .then((res) => {
        resetAnalysis; // 분석 상태 초기화
      });

    await useAnalyzingStore.getState().resetAnalysis();

    if (router) {
      await router.push(`/result/${analyzeId}`);
    }
  };

  const openModal = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const confirmResetAnalysis = () => {
    resetAnalysis(); // 분석 중지
    closeModal(); // 모달 닫기
  };

  return (
    hasJWT && (
      <div className="flex justify-center items-center">
        {isAnalyzing && (
          <div className="flex justify-center items-center">
            {isCompleted ? (
              <div>
                <button
                  className="px-4 py-1 bg-appBlue1 text-white font-bold rounded-lg"
                  onClick={handleCompletedButton}
                >
                  분석 결과 확인
                </button>
              </div>
            ) : (
              <span className="flex justify-center items-center">
                <p className="mx-2 font-bold">분석중지</p>
                <button
                  onClick={openModal}
                  className="text-red-600 font-extrabold"
                >
                  &#10005;
                </button>
              </span>
            )}
          </div>
        )}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2 className="text-lg font-bold">
                정말 분석을 중지하시겠습니까?
              </h2>
              <div className="flex justify-end mt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 mr-2 bg-gray-300 rounded"
                >
                  취소
                </button>
                <button
                  onClick={confirmResetAnalysis}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  중지
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
}
