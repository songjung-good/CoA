"use client";

import UseAxios from "@/api/common/useAxios";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import useCommonCodeStore from "@/store/commoncode";
import CloseIcon from "@/icons/CloseIcon";
import SkillListEdit from "./SkillListEdit";
interface Skill {
  codeId: number;
  codeName: string;
}

interface Member {
  memberUuid: string;
  memberNickName: string;
  memberImg: string;
  memberIntro: string;
  skillList: Skill[];
  memberJobCodeId: number;
  isMine: boolean;
  isBookmark: boolean;
}

export default function MyInfoEditCard({
  intro,
  skills,
  jop,
  closeEdit,
  setMyData,
}: {
  intro: string;
  skills: Skill[];
  jop: string;
  closeEdit: () => void;
  setMyData: Dispatch<SetStateAction<Member | undefined>>;
}) {
  const { response } = useCommonCodeStore.getState();
  const [introduce, setIntroduce] = useState(intro);
  const [skillCodeId, setSkillCodeId] = useState("");
  const [skillCodeName, setSkillCodeName] = useState("");
  const [skillIdList, setSkillIdList] = useState(skills);
  const [jobCodeId, setJobCodeId] = useState(jop);
  const jobObj = response.result.commonCodeList[2].codes;
  const skillObj = response.result.commonCodeList[3].codes;
  const putMyData = async () => {
    try {
      const skillIds = skillIdList.map((skill) => skill.codeId);

      const putResponse = await UseAxios().put(`/api/member/edit`, {
        introduce: introduce,
        skillIdList: skillIds,
        jobCodeId: parseInt(jobCodeId, 10),
      });
      // putResponse를 받은 후에 데이터 업데이트
      setMyData((prevData: Member | undefined) => {
        if (!prevData) return prevData; // 이전 상태가 없으면 그대로 반환

        return {
          ...prevData,
          memberIntro: introduce,
          skillList: skillIdList,
          memberJobCodeId: parseInt(jobCodeId, 10),
        };
      });
      // console.log(introduce);
      // console.log(skillIdList);
      // console.log(skillIds);
      // console.log(putResponse);
    } catch (error) {
      console.error("'유저 정보 수정'요청 에러", error);
      // console.log(introduce);
      // console.log(skillIdList);
      // console.log(jobCodeId);
    }
  };
  const onSubmit = () =>
    // e: React.FormEvent<HTMLFormElement>
    {
      // e.preventDefault();
      putMyData();
      closeEdit();
    };

  const onChangeSkill = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedSkillName = e.target.value;
    const selectedSkillId = Object.keys(skillObj || {}).find(
      (key) => skillObj && skillObj[key] === selectedSkillName,
    );
    setSkillCodeName(selectedSkillName);
    setSkillCodeId(selectedSkillId || "");
  };

  const addSkill = () => {
    // skillCodeId와 skillCodeName이 빈 문자열이 아닌지 확인
    if (skillCodeId !== "" && skillCodeName !== "") {
      // 새로운 기술 스택 객체 생성
      const newSkill = {
        codeId: parseInt(skillCodeId, 10),
        codeName: skillCodeName,
      };

      // 이미 있는 기술 스택인지 확인
      const isSkillAlreadyExist = skillIdList.some(
        (skill) => skill.codeId === parseInt(skillCodeId, 10),
      );

      // 이미 있는 경우 추가하지 않음
      if (!isSkillAlreadyExist) {
        // 기존의 skillIdList에 새로운 기술 스택 추가
        setSkillIdList((prevSkillList) => [...prevSkillList, newSkill]);
        // 기술 스택 입력 필드 초기화
        setSkillCodeId("");
        setSkillCodeName("");
      } else {
        setSkillCodeId("");
        setSkillCodeName("");
      }
    }
  };

  const inputStyle = "bg-appGrey1 border hover:border-appBlue1";
  return (
    <div
      className="card flex flex-col gap-4 absolute w-4/5 z-50"
      // onSubmit={onSubmit}
    >
      <button className="absolute right-4" onClick={closeEdit}>
        <CloseIcon />
      </button>
      <label>
        포지션 :
        {jobObj && (
          <select
            value={jobCodeId}
            onChange={(e) => setJobCodeId(e.target.value)}
            className={`${inputStyle} p-2 rounded-2xl`}
          >
            {Object.entries(jobObj).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        )}
      </label>
      <label htmlFor="introduce">
        <p>자기 소개 글</p>
        <textarea
          id="introduce"
          className={`${inputStyle} p-4 rounded-2xl w-full`}
          rows={3}
          value={introduce}
          onChange={(e) => setIntroduce(e.target.value)}
        />
      </label>
      <div>
        <label htmlFor="skillIdList">기술 스택</label>
        <SkillListEdit
          skillIdList={skillIdList}
          setSkillIdList={setSkillIdList}
        />
        <div className="flex flex-col">
          <input
            className={`${inputStyle} p-2 rounded-t-2xl grow`}
            list="skillIdDataList"
            id="skillIdList"
            name="skillIdList"
            value={skillCodeName}
            placeholder="기술 스택을 입력하세요"
            onChange={onChangeSkill}
          />
          <button
            className="bg-appGrey2 p-2 rounded-b-2xl hover:bg-appBlue1"
            onClick={addSkill}
          >
            추가하기
          </button>
        </div>
        {skillObj && (
          <datalist id="skillIdDataList">
            (
            {Object.entries(skillObj).map(([key, value]) => (
              <option key={key} value={value}></option>
            ))}
            )
          </datalist>
        )}
      </div>

      <div className="grid">
        <button
          onClick={onSubmit}
          className="bg-appBlue2 p-2 rounded-full hover:bg-appBlue1"
        >
          수정하기
        </button>
      </div>
    </div>
  );
}
