"use client";

import Image from "next/image";
import IsStar from "./IsStar";
import userStore from "@/store/user";

export default function UserCard() {
  const userName = userStore((state) => state.githubUserName);
  return (
    <section className="card flex flex-col gap-4 ">
      <div className="flex flex-row gap-4">
        <Image src="/image/logo144.png" alt="logo" width={144} height={144} />
        <div className="grow flex flex-col gap-2">
          <div className="flex justify-between">
            <p>닉네임 / userName: {userName}</p>
            <IsStar />
          </div>
          <div className="bg-appGrey1 p-4 rounded-2xl grow">
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
