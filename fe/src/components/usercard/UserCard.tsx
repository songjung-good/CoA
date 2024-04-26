"use client";

import Image from "next/image";
import IsStar from "./IsStar";
import userStore from "@/store/user";

export default function UserCard() {
  const userName = userStore((state) => state.userName);
  return (
    <section className="flex flex-col gap-4 bg-appGrey1 p-4 m-4 rounded-2xl">
      <div className="flex flex-row gap-4">
        <Image src="/image/logo144.png" alt="logo" width={144} height={144} />
        <div className="grow flex flex-col gap-2">
          <div className="flex justify-between">
            <p>닉네임 / userName: {userName}</p>
            <IsStar isStar={false} />
          </div>
          <div className="bg-appGrey2 p-4 rounded-2xl grow">
            <p>자기소개 글</p>
          </div>
        </div>
      </div>

      <div className="skills-container">
        <p>기술 스택 : </p>
      </div>
    </section>
  );
}