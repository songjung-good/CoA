"use client";

import React, { useState, useEffect, useRef, MutableRefObject } from "react";
import { useRouter } from "next/navigation";
import { colorMapping } from "@/components/colorMap";
import useCommonCodeStore from "@/store/commoncode";
import useResultStore from "@/store/result";
import useAnalyzingStore from "@/store/analyze";
import useRepoDetailStore from "@/store/repodetail";
import UseAxios from "@/api/common/useAxios";

// Props 타입 정의
interface RepoCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSave: MutableRefObject<boolean>;
}

interface SkillOption {
  key: string;
  value: string;
}

const RepoCardModal: React.FC<RepoCardModalProps> = ({
  isOpen,
  onClose,
  isSave,
}) => {
  const { response } = useCommonCodeStore.getState();
  const [selectedStack, setSelectedStack] = useState("");
  const [skillOptions, setSkillOptions] = useState<SkillOption[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<SkillOption[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const router = useRouter();
  const axios = UseAxios();
  const searchRef = useRef<HTMLDivElement>(null);

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

  const handleSearchFocus = () => {
    setFilteredOptions(skillOptions);
  };

  // 모달 외부 클릭 이벤트 핸들러
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setFilteredOptions([]); // 외부 클릭 시 필터링된 옵션 초기화
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

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
      setFilteredOptions([]); // 필터링된 옵션 초기화
    }
  }, [response]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      setFilteredOptions(
        skillOptions.filter((option) =>
          option.value.toLowerCase().includes(term.toLowerCase()),
        ),
      );
    } else {
      setFilteredOptions(skillOptions);
    }
  };

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
    setSearchTerm(""); // 검색어 초기화
    setFilteredOptions([]); // 필터링된 옵션 초기화
  };

  const handleRemoveStack = (index: number) => {
    setStacks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    setIsLoading(true); // 로딩 상태를 true로 설정
    // 폼 제출 로직 구현, 예: API 호출 등
    const analyzeId = useAnalyzingStore.getState().analyzeId;
    let repoViewId = 0;
    // 여기에 수정 로직을 추가하세요
    // 분석 저장 로직 ------------------------------------------------------------------
    const data = {
      repoViewTitle: title,
      repoViewSubtitle: subtitle,
      repoStartDate: startDate,
      repoEndDate: endDate,
      repoViewMemberCnt: memberCount,
      repoViewSkillList: stacks.map((stack) => stack),
    };

    try {
      const saveResponse = await axios.post(`/api/repos/${analyzeId}`, data);
      repoViewId = saveResponse.data.result;

      const detailResponse = await axios.get(`/api/repos/${repoViewId}`);
      useRepoDetailStore.getState().updateResultState(detailResponse.data); // 분석 결과 데이터 저장

      if (!repoViewId) {
        throw new Error("repoViewId가 정의되지 않았습니다.");
      }

      onClose();
      router.push(`/repo/${repoViewId}`);
    } catch (error) {
      console.error("저장 중 오류 발생:", error);
      onClose();
      router.push("/error");
    } finally {
      setIsLoading(false); // 로딩 상태를 false로 설정
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
      <div className="bg-white p-5 rounded-lg shadow-lg relative w-full max-w-sm sm:max-w-lg lg:max-w-2xl z-40">
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
          <div className="mb-4" ref={searchRef}>
            <label
              htmlFor="stackDropdown"
              className="block mb-2 text-sm font-medium"
            >
              사용 기술
            </label>
            <input
              type="text"
              id="stackDropdown"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
              placeholder="기술을 검색하세요"
            />
            {filteredOptions.length > 0 && (
              <ul className="bg-white border border-gray-300 rounded-lg mt-2 absolute z-10 w-[93%] max-h-60 overflow-y-auto">
                {filteredOptions.map((option) => (
                  <li
                    key={option.key}
                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer w-full"
                    onClick={() => handleChangeStack(option.value)}
                  >
                    {option.value}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {stacks.length === 0 ? (
            <div className="mb-2">사용한 기술 스택을 추가해주세요.</div>
          ) : (
            <ul className="flex flex-wrap">
              {stacks.map((key, index) => (
                <li
                  key={index}
                  className={`flex justify-between items-center px-4 py-2 mr-4 mb-2 shadow-lg rounded-lg font-bold hover:cursor-pointer`}
                  style={{
                    padding: "6px 8px",
                    borderRadius: "9999px",
                    backgroundColor: `${
                      colorMapping[
                        `${
                          skillOptions.find(
                            (option) => parseInt(option.key) === key,
                          )?.value || key
                        }`
                      ]
                    }`,
                  }}
                  onClick={() => handleRemoveStack(index)}
                >
                  <div className="flex justify-center items-center">
                    <span className="text-white px-1">
                      {skillOptions.find(
                        (option) => parseInt(option.key) === key,
                      )?.value || key}
                    </span>
                    <div className="px-1 text-xs text-white">&#10005;</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              className="text-white bg-appBlue1 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-base py-2.5 px-5"
              onClick={() => {
                isSave.current = true;
              }}
              disabled={isLoading} // 로딩 중일 때 버튼 비활성화
            >
              {isLoading ? (
                <div className="flex">
                  <img
                    src="/image/LoadingSpinner.gif"
                    alt="로딩 스피너"
                    width={20}
                    height={40}
                  />
                  <p>저장중입니다...</p>
                </div>
              ) : (
                "저장하기"
              )}{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepoCardModal;
