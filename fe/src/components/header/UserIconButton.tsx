"use client";

import userStore from "@/store/user";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import UseAxios from "@/api/common/useAxios";
import useCommonCodeStore from "@/store/commoncode";
import UserMenu from "./UserMenu";

export default function UserIconButton() {
  const userImage = userStore((state) => state.userImage);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalClose = () => {
    setIsOpen(false);
  };
  const axiosInstance = UseAxios();
  const { setResponse } = useCommonCodeStore.getState();

  const fetchCommonCodeData = async () => {
    try {
      const response = await axiosInstance.get("/api/common/code");
      setResponse(response.data);
    } catch (error) {
      console.error("'/api/common/code'요청 에러", error);
    }
  };
  //서버에서 유저 데이터를 받아오고 전역state에 저장
  const fetchMemberData = async () => {
    try {
      const response = await axiosInstance.get("/api/member");
      // console.log(response);
      const memberData = response.data.result;
      userStore.setState({
        UUID: memberData.memberUuid,
        userImage: memberData.memberImg,
        githubUserName: memberData.accountLinkInfoDto.githubNickName,
        isGithubToken: memberData.accountLinkInfoDto.isGithubToken,
        gitlabUserName: memberData.accountLinkInfoDto.gitlabNickName,
        isGitlabToken: memberData.accountLinkInfoDto.isGitlabToken,
        AuthUserName: memberData.memberNickName,
        solvedacNickName: memberData.accountLinkInfoDto.solvedacNickName,
        codeforcesNickName: memberData.accountLinkInfoDto.codeforcesNickName,
      });
    } catch (error) {
      console.error("'/api/member'요청 에러", error);
    }
  };
  useEffect(() => {
    fetchCommonCodeData();
    fetchMemberData();
    //모달 밖을 누르면 모달창 닫힘
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex justify-center items-center" ref={modalRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="rounded-full overflow-hidden w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10">
          <img
            src={userImage}
            alt="user Image"
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
      </button>
      {isOpen ? <UserMenu modalClose={modalClose} /> : null}
    </div>
  );
}
