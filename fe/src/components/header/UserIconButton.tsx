"use client";

import userStore from "@/store/user";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import UseAxios from "@/api/common/useAxios";
import useCommonCodeStore from "@/store/commoncode";

export default function UserIconButton() {
  const UUID = userStore((state) => state.UUID);
  const userImage = userStore((state) => state.userImage);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const axiosInstance = UseAxios();
  const { response, setResponse } = useCommonCodeStore.getState();

  const fetchCommonCodeData = async () => {
    try {
      const response = await axiosInstance.get("/api/common/code");
      setResponse(response.data);
    } catch (error) {
      console.error("'/api/common/code'요청 에러", error);
    }
  };

  const fetchMemberData = async () => {
    try {
      const response = await axiosInstance.get("/api/member");
      console.log(response);
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

  const logout = async () => {
    try {
      const response = await axiosInstance.post("/api/auth/logout");
      window.location.href = "/";
    } catch (error) {
      console.error("logout 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <div className="relative flex justify-center items-center" ref={modalRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div
          style={{
            border: "solid",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          {/* 추후 Image tag로 최적화 하기 
          https://nextjs.org/docs/app/building-your-application/optimizing/images#remote-images
          Image의 링크 config에 등록해야함
          */}
          <img
            // loader={() => userImage}
            src={userImage}
            alt="logo"
            width={48}
            height={48}
            style={{
              width: "48px",
              height: "48px",
            }}
          />
        </div>
      </button>
      {isOpen ? (
        <div className="absolute top-11 right-0 card min-w-28 z-50">
          <ul className="flex flex-col gap-4">
            <li>
              <Link href={`/user/${UUID}`}>마이 페이지</Link>
            </li>
            <li>
              <Link href={`/auth/link`}>연동 페이지</Link>
            </li>
            <li>
              <button onClick={logout}>로그아웃</button>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
