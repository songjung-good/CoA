// "use client";

// import RepoInfo from "./_components/RepoInfo";
// import ResultTap from "./_components/ResultTap";
// import useRepoDetailStore from "@/store/repodetail";

// export default function RepoPage({ params }: { params: { id: string } }) {
//   const userNickName = useRepoDetailStore(
//     (state) => state.result.repoCardDto.memberNickname,
//   ); // 이후 유저닉네임으로 변경
//   return (
//     <div className="flex flex-col items-center bg-appGrey1 pt-5 p-10 w-full h-full">
//       <div className="sm:w-4/5 lg:w-3/5 lg:min-w-760px">
//         <p className="mb-5 text-xl font-bold sm:text-2xl text-center">
//           {`${userNickName}님의 레포지토리 분석 결과입니다.`}
//         </p>
//         <RepoInfo />
//         <ResultTap />
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";

import RepoInfo from "@/components/repodetail/RepoInfo.tsx";
import ResultTap from "@/components/repodetail/ResultTap.tsx";
import useRepoDetailStore from "@/store/repodetail";
import RepoCardModal from "@/components/repodetail/RepoCardModal";

import "./_components/result.css";

export default function RepoPage({ params }: { params: { id: string } }) {
  const repoTitle = useRepoDetailStore(
    (state) => state.result.repoCardDto.repoViewTitle,
  ); // 이후 유저닉네임으로 변경

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달을 열기 위한 함수
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달을 닫기 위한 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="flex flex-col items-center bg-appGrey1 pt-5 p-10 w-full h-full">
      <div className="sm:w-4/5 lg:w-3/5 lg:min-w-760px">
        <p className="mb-5 text-xl font-bold sm:text-2xl text-center">
          {`${repoTitle} 레포지토리 상세 정보입니다.`}
        </p>
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
