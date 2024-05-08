"use client";

import userStore from "@/store/user";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function UserIconButton() {
  const authUserName = userStore((state) => state.AuthUserName);
  const userImage = userStore((state) => state.userImage);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
        <div
          style={{
            border: "solid",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <Image src={userImage} alt="logo" width={48} height={48} />
        </div>
      </button>
      {isOpen ? (
        <div className="absolute top-11 right-0 card min-w-28">
          <ul className="flex flex-col gap-4">
            <li>
              <Link href={`/user/${authUserName}`}>마이 페이지</Link>
            </li>
            <li>
              <Link href={`/auth/link`}>연동 페이지</Link>
            </li>
            <li>
              <button>로그아웃</button>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
