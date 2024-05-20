"use client";

import { useState, useEffect } from "react";
import UseAxios from "@/api/common/useAxios";
import RepoInfo from "@/components/repodetail/RepoInfo.tsx";
import ResultTap from "@/components/repodetail/ResultTap.tsx";
import useRepoDetailStore from "@/store/repodetail";
import RepoCardModal from "@/components/repodetail/RepoCardModal";

import "./_components/result.css";

export default function RepoPage({ params }: { params: { id: string } }) {
  const repoTitle = useRepoDetailStore(
    (state) => state.result.repoCardDto.repoViewTitle,
  );
  const axios = UseAxios();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setIsLoading(true); // 데이터 로딩 시작
    axios
      .get(`/api/repos/${params.id}`)
      .then((res) => {
        useRepoDetailStore.getState().updateResultState(res.data);
        // console.log(res.data);
      })
      .catch((error) => {
        console.error("데이터 로딩 중 오류 발생:", error);
      })
      .finally(() => {
        setIsLoading(false); // 데이터 로딩 완료
      });
  }, []);

  if (isLoading) {
    return null; // 로딩 인디케이터 또는 컴포넌트 표시
  }

  return (
    <div className="flex flex-col items-center bg-appGrey1 pt-5 p-10 w-full h-full">
      <div className="w-full sm:w-4/5 lg:w-3/5 lg:min-w-[850px]">
        <div className="w-full text-center mb-5 whitespace-pre-wrap break-words">
          <span className="text-appBlue1 text-lg font-bold sm:text-2xl text-center">
            {repoTitle}
          </span>
          <span className="text-lg font-bold sm:text-2xl text-center ">
            {` 레포지토리 상세 정보입니다.`}
          </span>
        </div>
        <RepoInfo openModal={openModal} />
        <ResultTap />
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <RepoCardModal isOpen={isModalOpen} onClose={closeModal} />
          </div>
        )}
      </div>
    </div>
  );
}
