"use client";

import tw from "tailwind-styled-components";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import useRepoDetailStore from "@/store/repodetail";
import ReadmeEdit from "./_components/ReadmeEdit";
import RepoViewComment from "./_components/RepoViewComment";
import SuccessModal from "@/components/repodetail/SuccessModal";
import CommonButton from "@/components/result/CommonButton";

import "@/app/result/[id]/_components/result.css";

import { useEffect, useState } from "react";

export default function ReadmeEditPage() {
  const repoTitle =
    useRepoDetailStore.getState().result.repoCardDto.repoViewTitle;
  const [tabIndex, setTabIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const params = useParams();

  const [title, setTitle] = useState("");

  useEffect(() => {
    // 데이터를 fetch하고, 완료되면 상태를 업데이트
    const fetchRepoTitle = async () => {
      const title =
        await useRepoDetailStore.getState().result.repoCardDto.repoViewTitle;
      setTitle(title);
    };

    fetchRepoTitle();
  }, []);

  useEffect(() => {
    setTitle(repoTitle);
  }, []);

  const handleTab = (index: number) => {
    setLastIndex(tabIndex); // 이전 tabIndex 값을 lastIndex로 설정
    setTabIndex(index);
  };

  const slideDirection = tabIndex > lastIndex ? "slide-right" : "slide-left";
  const tabComponents = [
    <ReadmeEdit setShowModal={setShowModal} />,
    <RepoViewComment setShowModal={setShowModal} />,
  ];

  return (
    <div className="bg-appGrey1 h-full">
      <div className="flex flex-col items-center pt-4 w-full h-full">
        {title ? (
          <p className="mb-5 text-xl font-bold sm:text-2xl">
            {`${title} 프로젝트 수정`}
          </p>
        ) : (
          <p className="mb-5 text-xl font-bold sm:text-2xl">로딩 중입니다...</p>
        )}
      </div>
      <div className="flex w-full justify-evenly mb-4">
        <TabButton
          onClick={() => handleTab(0)}
          className={`${tabIndex === 0 ? "border-appBlue1 text-appBlue1" : ""} transition duration-300 ease-in-out`}
        >
          리드미 수정
        </TabButton>
        <TabButton
          onClick={() => handleTab(1)}
          className={`${tabIndex === 1 ? "border-appBlue1 text-appBlue1" : ""} transition duration-300 ease-in-out`}
        >
          코멘트
        </TabButton>
      </div>
      <TransitionGroup component={null}>
        <CSSTransition key={tabIndex} timeout={500} classNames={slideDirection}>
          <div className="flex justify-center w-full min-h-[75vh] ">
            {tabComponents[tabIndex]}
          </div>
        </CSSTransition>
      </TransitionGroup>
      <div className="flex justify-center pb-12">
        <Link href={`/repo/${params.id}`}>
          <CommonButton text="상세 페이지로 이동" onClick={() => {}} />
        </Link>
      </div>
      {showModal && (
        <SuccessModal
          title="저장 성공"
          message="변경사항이 성공적으로 저장되었습니다."
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
}

const TabButton = tw.button`
  border-b-2 px-3 py-2 text-sm
  sm:px-2 sm:text-sm
  md:px-2 md:text-base
  lg:px-2 lg:text-lg
`;
