"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useCommonCodeStore from "@/store/commoncode";
// import useRepoDetailStore from "@/store/result";
import useRepoDetailStore from "@/store/repodetail";
import UseAxios from "@/api/common/useAxios";

// Props 타입 정의
interface RepoCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SkillOption {
  key: string;
  value: string;
}

const RepoCardModal: React.FC<RepoCardModalProps> = ({ isOpen, onClose }) => {
  const { response } = useCommonCodeStore.getState();
  const [selectedStack, setSelectedStack] = useState("");
  const [skillOptions, setSkillOptions] = useState<SkillOption[]>([]);
  const axios = UseAxios();
  const params = useParams();

  // 결과 데이터
  const { result } = useRepoDetailStore((state) => state);
  const [title, setTitle] = useState<string>(
    result.repoCardDto.repoViewTitle || "",
  );
  const [subtitle, setSubtitle] = useState<string>(
    result.repoCardDto.repoViewSubtitle || "",
  );
  const [startDate, setStartDate] = useState<string>(
    result.repoCardDto.repoStartDate || "",
  );
  const [endDate, setEndDate] = useState<string>(
    result.repoCardDto.repoEndDate || "",
  );
  const [memberCount, setMemberCount] = useState<number>(
    result.repoCardDto.repoMemberCnt || 0,
  );
  const [stacks, setStacks] = useState<string[]>(
    result.repoCardDto.skillList?.map((skill) => skill.codeName) || [],
  );
  // 결과 데이터

  useEffect(() => {
    setTitle(result.repoCardDto.repoViewTitle);
    setSubtitle(result.repoCardDto.repoViewSubtitle);
    setStartDate(result.repoCardDto.repoStartDate);
    setEndDate(result.repoCardDto.repoEndDate);
    setMemberCount(result.repoCardDto.repoMemberCnt);
    setStacks(
      result.repoCardDto.skillList?.map((skill) => skill.codeName) || [],
    );
  }, [result]);

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setDate: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setDate(event.target.value);
  };

  useEffect(() => {
    // 스킬 목록 초기화
    if (response.result && response.result.commonCodeList.length > 3) {
      const skillCodes = response.result.commonCodeList[3].codes;
      const options = skillCodes
        ? Object.entries(skillCodes).map(([key, value]) => ({ key, value }))
        : [];
      setSkillOptions(options);
    }
  }, [response]);

  const handleChangeStack = (value: string) => {
    if (value && !stacks.includes(value)) {
      setStacks((prev) => [...prev, value]);
    }
    setSelectedStack(value);
  };

  const handleRemoveStack = (index: number) => {
    setStacks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    // 폼 제출 로직 구현, 예: API 호출 등
    console.log("수정 API 구현해라!");
    // 여기에 수정 로직을 추가하세요
    // const data = {
    //   repoViewTitle: title,
    //   repoViewSubtitle: subtitle,
    //   repoStartDate: startDate,
    //   repoEndDate: endDate,
    //   repoMemberCnt: memberCount,
    //   repoViewSkillList: stacks.map((stack) => ({
    //     skillCode: parseInt(stack),
    //   })), // 정수 타입으로 변경
    // };
    // await axios
    //   .put(`/api/repos/repoCard/${params.id}`, data)
    //   .then((res) => {
    //     console.log("데이터 변경 성공");
    //     onClose();
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     console.log("데이터 변경 실패");
    //   });

    // 수정 후 데이터 store 변경
    // await axios.get(`/api/repos/${params.id}`).then((res) => {
    //   useRepoDetailStore.getState().updateResultState(res.data);
    // });
    // 수정 완료 후 모달 닫기
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-lg relative w-full max-w-sm sm:max-w-lg lg:max-w-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-transparent font-bold hover:text-red-600 p-1 rounded-full"
          aria-label="Close"
        >
          &#10005;
        </button>
        <h2 className="text-2xl font-bold mb-2">레포정보 수정하기</h2>
        <hr className="mb-2" />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-sm font-medium">
              제목 (Title)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id="title"
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
              placeholder="제목을 입력하세요."
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="subtitle"
              className="block mb-2 text-sm font-medium"
            >
              부제목 (SubTitle)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              id="subtitle"
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
              placeholder="부제목을 입력하세요."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium mb-2"
              >
                시작 날짜
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => handleDateChange(e, setStartDate)}
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
                required
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium mb-2"
              >
                종료 날짜
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => handleDateChange(e, setEndDate)}
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="memberCount"
              className="block text-sm font-medium mb-2"
            >
              프로젝트 인원
            </label>
            <input
              type="number"
              id="memberCount"
              value={memberCount}
              onChange={(e) => setMemberCount(Number(e.target.value))}
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
              placeholder="인원 수를 입력하세요"
              min="1"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="stackDropdown"
              className="block mb-2 text-sm font-medium"
            >
              사용 기술
            </label>
            <select
              id="stackDropdown"
              value={selectedStack}
              onChange={(e) => handleChangeStack(e.target.value)}
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
            >
              <option value="">기술을 선택하세요</option>
              {skillOptions.map((option) => (
                <option key={option.key} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
          </div>
          {stacks.length === 0 ? (
            <div className="mb-2">사용한 기술 스택을 추가해주세요.</div>
          ) : (
            <ul className="flex flex-wrap">
              {stacks.map((stack, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-2 border-appBlue1 px-4 py-2 mr-4 mb-2 hover:cursor-pointer shadow-lg rounded-lg"
                  onClick={() => handleRemoveStack(index)}
                >
                  {stack}
                  {"  "}
                  <div className=" font-bold ml-2 text-xs text-red-600">
                    &#10005;
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              className="text-white bg-appBlue1 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-base py-2.5 px-5"
            >
              수정하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepoCardModal;
