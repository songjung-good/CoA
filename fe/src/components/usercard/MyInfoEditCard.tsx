"use client";

import Image from "next/image";
import userStore from "@/store/user";
import EditIconDark from "@/icons/EditIconDark";
import UseAxios from "@/api/common/useAxios";
import { useState } from "react";
import useCommonCodeStore from "@/store/commoncode";
interface Skill {
  codeId: number;
  codeName: string;
}
export default function MyInfoEditCard({
  intro,
  skills,
  jop,
}: {
  intro: string | undefined;
  skills: Skill[] | undefined;
  jop: string | undefined;
}) {
  const { response } = useCommonCodeStore.getState();
  const [introduce, setIntroduce] = useState(intro);
  const [skillIdList, setSkillIdList] = useState(skills);
  const [jobCodeId, setJobCodeId] = useState(jop);
  const jobObj = response.result.commonCodeList[2].codes;
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
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <form className="card flex flex-col gap-4 absolute" onSubmit={onSubmit}>
      <label>
        포지션 : {jobCodeId}
        {jobObj && (
          <select
            value={jobCodeId}
            onChange={(e) => setJobCodeId(e.target.value)}
            className="border hover:border-appBlue1"
          >
            {Object.entries(jobObj).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        )}
      </label>

      <label>
        기술스택 :
        <input type="text" />
      </label>
      <label htmlFor="introduce">
        <p>자기 소개 글</p>
        <input
          id="introduce"
          className="bg-appGrey1 p-4 rounded-2xl grow"
          type="text"
          value={introduce}
          onChange={(e) => setIntroduce(e.target.value)}
        />
      </label>
    </form>
  );
}
