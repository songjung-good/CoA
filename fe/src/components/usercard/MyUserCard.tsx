"use client";

import Image from "next/image";
import userStore from "@/store/user";
import EditIconDark from "@/icons/EditIconDark";
import UseAxios from "@/api/common/useAxios";

export default function MyUserCard() {
  const { AuthUserName, userImage } = userStore();
  const putMyData = async (
    introduce: string,
    skillIdList: number[],
    jobCodeId: number,
  ) => {
    try {
      const putResponse = await UseAxios().put(`/api/member/edit`, {
        introduce: introduce,
        skillIdList: skillIdList,
        jobCodeId: jobCodeId,
      });
    } catch (error) {
      console.error("'유저 정보 수정'요청 에러", error);
    }
  };
  return (
    <section className="card flex flex-col gap-4 ">
      <div className="flex flex-row gap-4">
        {/* <Image src="/image/logo144.png" alt="logo" width={144} height={144} /> */}
        <div className="rounded-full overflow-hidden">
          <img src={userImage} alt="logo" width={144} height={144} />
        </div>
        <div className="grow flex flex-col gap-2">
          <div className="flex justify-between">
            <p>{AuthUserName}</p>
            <button>
              <EditIconDark />
            </button>
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
