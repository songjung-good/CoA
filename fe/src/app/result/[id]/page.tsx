"use client";

import { useState, useEffect, useRef } from "react";
import UseAxios from "@/api/common/useAxios";
import { useRouter } from "next/navigation";
import RepoInfo from "@/components/result/RepoInfo.tsx";
import ResultTap from "@/components/result/ResultTap.tsx";
import useResultStore from "@/store/result";
import RepoCardModal from "@/components/result/RepoCardModal";

import "./_components/result.css";

export default function ResultPage({ params }: { params: { id: string } }) {
  const userNickName = useResultStore(
    (state) => state.result.repoCardDto.memberNickname,
  ); // 이후 유저닉네임으로 변경
  const axios = UseAxios();

  const isSave = useRef(false);

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  // 모달을 열기 위한 함수
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달을 닫기 위한 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 페이지 언로드 또는 경고창을 설정하는 useEffect
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSave.current) {
        const message =
          "이 페이지를 떠나시겠습니까? 변경 사항이 저장되지 않을 수 있습니다.";
        e.returnValue = message;
        return message;
      }
      return;
    };

    const handlePopState = () => {
      if (!isSave.current) {
        const confirmation = window.confirm(
          "이 페이지를 떠나시겠습니까? 변경 사항이 저장되지 않을 수 있습니다.",
        );
        if (!confirmation) {
          window.history.pushState(null, "", window.location.pathname);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // useEffect(() => {
  //   axios.get(`/api/repos/analysis/done/${params.id}`).then((res) => {
  //     useResultStore.getState().updateResultState(res.data);
  //     console.log(res.data);
  //   });
  // }, []);

  return (
    <div className="flex flex-col items-center bg-appGrey1 pt-5 p-10 w-full h-full">
      <div className="w-full sm:w-4/5 lg:w-3/5 lg:min-w-[850px]">
        <div className="w-full text-center mb-5 whitespace-pre-wrap break-words">
          <span className="text-appBlue1 text-lg font-bold sm:text-2xl text-center">
            {userNickName}
          </span>
          <span className="text-lg font-bold sm:text-2xl text-center ">
            {` 님의 레포지토리 분석 결과입니다.`}
          </span>
        </div>
        <RepoInfo />
        <ResultTap openModal={openModal} />
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-9999 flex justify-center items-center">
            <RepoCardModal
              isOpen={isModalOpen}
              onClose={closeModal}
              isSave={isSave}
            />
          </div>
        )}
      </div>
      <p className="mt-10 text-sm sm:text-xl">
        해당 페이지를 떠나면{" "}
        <span className="text-appBlue1">분석한 데이터</span>가 사라집니다.
      </p>
    </div>
  );
}
