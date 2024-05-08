import React from "react";

import UseAxios from "@/api/common/useAxios";

// Props 타입 정의
interface RepoCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RepoCardModal: React.FC<RepoCardModalProps> = ({ isOpen, onClose }) => {
  const axiosInstance = UseAxios();

  // 모달이 열리지 않았다면 null 반환
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-900 text-white p-5 rounded-lg shadow-lg relative w-full max-w-sm sm:max-w-lg lg:max-w-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white bg-transparent hover:bg-gray-700 hover:text-white p-1 rounded-full"
          aria-label="Close"
        >
          &#10005;
        </button>
        <h2 className="text-2xl font-bold pb-5">레포정보 수정하기</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              제목 (Title)
            </label>
            <input
              type="text"
              id="title"
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
              placeholder="제목을 입력하세요."
              required
              value=""
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              부제목(SubTitle)
            </label>
            <input
              type="text"
              id="subtitle"
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
              placeholder="부제목을 입력하세요."
              required
              value=""
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium"
            >
              프로젝트 기간
            </label>
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium"
            >
              프로젝트 인원
            </label>
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium"
            >
              사용 기술 스택
            </label>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 px-5"
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
