"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import useCommonCodeStore from "@/store/commoncode";
import useResultStore from "@/store/result";
import useAnalyzingStore from "@/store/analyze";
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
  const router = useRouter();
  const axios = UseAxios();

  // 결과 데이터
  const { result } = useResultStore((state) => state);
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
  const [stacks, setStacks] = useState<number[]>(
    result.repoCardDto.skillList?.map((skill) => skill.codeId) || [],
  );
  // 결과 데이터

  useEffect(() => {
    // 결과 데이터 불러오기 및 초기화
    const repoData = useResultStore.getState().result.repoCardDto;
    setTitle(repoData.repoViewTitle || "");
    setSubtitle(repoData.repoViewSubtitle || "");
    setStartDate(repoData.repoStartDate || "");
    setEndDate(repoData.repoEndDate || "");
    setMemberCount(repoData.repoMemberCnt || 0);
    setStacks(
      repoData.skillList ? repoData.skillList.map((skill) => skill.codeId) : [],
    );
  }, []);

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
    // 선택된 value를 기반으로 key를 찾아 stacks 배열에 추가
    const selectedOption = skillOptions.find(
      (option) => option.value === value,
    );
    const selectedKey = selectedOption ? selectedOption.key : "";
    if (selectedKey && !stacks.includes(parseInt(selectedKey))) {
      setStacks((prev) => [...prev, parseInt(selectedKey)]);
    }
    setSelectedStack(selectedKey); // selectedStack 상태도 key로 관리
  };

  const handleRemoveStack = (index: number) => {
    setStacks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    // 폼 제출 로직 구현, 예: API 호출 등
    await console.log("저장!");
    const analyzeId = useAnalyzingStore.getState().analyzeId;
    let repoViewId = 0;
    // 여기에 수정 로직을 추가하세요
    // 분석 저장 로직 ------------------------------------------------------------------
    const data = {
      repoViewTitle: title,
      repoViewSubtitle: subtitle,
      repoStartDate: startDate,
      repoEndDate: endDate,
      repoMemberCnt: memberCount,
      skillIdList: stacks.map((stack) => stack),
    };

    console.log(data);

    await axios.post(`/api/repos/${analyzeId}`, data).then((res) => {
      console.log(res);
      repoViewId = res.data.result;
    });

    await axios.get(`/api/repos/${repoViewId}`).then((res) => {
      useRepoDetailStore.getState().updateResultState(res.data); // 분석 결과 데이터 저장
      console.log(res);
    });

    await router.push(`/repo/${repoViewId}`);
    // 분석 저장 로직 ------------------------------------------------------------------

    // 수정 완료 후 모달 닫기
    await onClose();

    // await axios.get(`/api/repos/9`).then((res) => {
    //   useRepoDetailStore.getState().updateResultState(res.data); // 분석 결과 데이터 저장
    //   console.log(res);
    // });
    // await await router.push(`/repo/9`);
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
        <h2 className="text-2xl font-bold mb-2">레포정보 저장하기</h2>
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
              {stacks.map((key, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-2 border-appBlue1 px-4 py-2 mr-4 mb-2 hover:cursor-pointer shadow-lg rounded-lg"
                  onClick={() => handleRemoveStack(index)}
                >
                  {skillOptions.find((option) => parseInt(option.key) === key)
                    ?.value || key}
                  <div className="font-bold ml-2 text-xs text-red-600">
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
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepoCardModal;
