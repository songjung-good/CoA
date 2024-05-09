"use client";

import userStore from "@/store/user";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import UseAxios from "@/api/common/useAxios";
import useCommonCodeStore from "@/store/commoncode";

export default function UserIconButton() {
  const authUserName = userStore((state) => state.AuthUserName);
  const userImage = userStore((state) => state.userImage);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const axiosInstance = UseAxios();
  const { response, setResponse } = useCommonCodeStore.getState();
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/api/common/code");
      setResponse(response.data);
    } catch (error) {
      console.error("'/api/common/code'요청 에러", error);
    }
  };
  useEffect(() => {
    fetchData();
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
          <Image
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
              <Link href={`/user/${authUserName}`}>마이 페이지</Link>
            </li>
            <li>
              <Link href={`/auth/link`}>연동 페이지</Link>
            </li>
            <li>
              <button onClick={logout}>로그아웃</button>
            </li>
            <li>
              <button
                onClick={() => {
                  console.log(response);
                }}
              >
                test
              </button>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
