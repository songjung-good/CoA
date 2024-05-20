"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import UseAxios from "@/api/common/useAxios";
import Image from "next/image";
import CloseIcon from "@/icons/CloseIcon";
import getServerUrl from "@/api/common/getServerUrl";

const serverUrl = getServerUrl(); // 서버 URL 가져오기

export default function LinkPage() {
  // 토큰 입력 모달
  const [githubTokenModal, setGithubTokenModal] = useState(false);
  const [gitlabTokenModal, setGitlabTokenModal] = useState(false);
  // 입력 받을 변수
  const [githubToken, setGithubToken] = useState("");
  const [gitlabToken, setGitlabToken] = useState("");

  // 반환 받을 변수
  const [hubNickName, setHubNickName] = useState("");
  const [labNickName, setLabNickName] = useState("");
  const [isHubToken, setIsHubToken] = useState("");
  const [isLabToken, setIsLabToken] = useState("");

  const axiosInstance = UseAxios();
  // fetchData 함수 정의
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("api/accountLink");
      const getData = response.data.result;

      setHubNickName(getData.githubNickName);
      setIsHubToken(getData.isGithubToken);

      setLabNickName(getData.gitlabNickName);
      setIsLabToken(getData.isGitlabToken);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // 컴포넌트가 마운트될 때 fetchData를 실행
  useEffect(() => {
    fetchData();
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때만 fetchData를 호출

  const handleGithubLogin = () => {
    window.location.href = `${serverUrl}/oauth2/authorization/github`;
  };

  const handleGitLabLogin = () => {
    window.location.href = `${serverUrl}/oauth2/authorization/gitlab`;
  };

  const saveAccessTokenGithub = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/accountLink/github",
        {
          // 요청 본문 데이터 (필요한 경우)
        },
        {
          headers: {
            "Access-Token": githubToken, // githubToken 값을 'Access-Token' 헤더에 포함
          },
        },
      );
      setGithubToken("");
      setGithubTokenModal(false);
    } catch (error) {
      console.error("GitHub Token 저장 중 오류가 발생했습니다:", error);
    }
  };
  const saveAccessTokenGitLab = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/accountLink/gitlab",
        {
          // 요청 본문 데이터 (필요한 경우)
        },
        {
          headers: {
            "Access-Token": gitlabToken, // githubToken 값을 'Access-Token' 헤더에 포함
          },
        },
      );
      setGitlabToken("");
      setGitlabTokenModal(false);
    } catch (error) {
      console.error("Gitlab Token 저장 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <main className="bg-appGrey1  flex flex-col items-center">
      <div className="max-w-screen-xl w-full flex flex-col py-4 gap-4">
        <section className={Header}>
          <h1 className="text-xl font-bold">계정 연동하기</h1>

          <Link
            className={ButtonGroup}
            href="/info"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className={Button}>토큰 발급 안내</p>
          </Link>
        </section>

        <section className="card flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <div>
              <Image
                src="/image/oauth/github-mark.svg"
                alt="github"
                width={100}
                height={100}
                style={{ width: "100px", height: "100px" }}
              />
            </div>
            <div>
              <p className="text-xl font-bold">GitHub</p>
              <p>UserName : {hubNickName}</p>
              <p>
                Token 등록:{" "}
                {isHubToken ? (
                  "토큰 등록 완료되었습니다"
                ) : (
                  <Link
                    className={AccessButton}
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    토큰 발급 링크
                  </Link>
                )}
              </p>
            </div>
          </div>
          <div className="max-w-52">
            <button
              aria-label="깃허브 연동하기"
              className="bg-white hover:bg-appGrey2 border shadow-lg rounded-t-xl p-4  flex gap-2  w-full"
              onClick={handleGithubLogin}
            >
              <Image
                src="/image/oauth/github-mark.svg"
                alt="githubSSO"
                width={24}
                height={24}
                style={{ width: "24px", height: "24px" }}
              />
              Sign in with GitHub
            </button>
            <button
              aria-label="깃허브 토큰 등록하기"
              className=" bg-appGrey1 hover:bg-appGrey2 border shadow-lg rounded-b-xl px-4 py-2 flex gap-2  w-full"
              onClick={() => {
                setGithubTokenModal(!githubTokenModal);
              }}
            >
              <Image
                src="/image/oauth/github-mark.svg"
                alt="githubSSO"
                width={24}
                height={24}
                style={{ width: "24px", height: "24px" }}
              />
              access token 등록
            </button>
          </div>
          {githubTokenModal ? (
            <div className="absolute">
              <label className="card flex flex-col gap-2">
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Image
                      src="/image/githubSSO.svg"
                      alt="githubSSO"
                      width={24}
                      height={24}
                      style={{ width: "24px", height: "24px" }}
                    />
                    access token 등록
                  </div>
                  <Link
                    className={AccessButton}
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    토큰발급링크
                  </Link>
                  <button
                    aria-label="깃허브 토큰 등록 취소하기"
                    onClick={() => {
                      setGithubTokenModal(false);
                    }}
                  >
                    <CloseIcon />
                  </button>
                </div>
                <div>
                  <input
                    type="password"
                    autoComplete="off"
                    className="py-1 px-2 bg-appGrey1 rounded-l-xl"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                  />
                  <button
                    aria-label="깃허브 토큰 저장하기"
                    className="py-1 px-2 bg-appGreen rounded-r-xl"
                    onClick={saveAccessTokenGithub}
                  >
                    Token 등록
                  </button>
                </div>
              </label>
            </div>
          ) : null}
        </section>
        {/* GitLab */}
        <section className="card flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <div>
              <Image
                src="/image/oauth/gitlab-mark.svg"
                alt="github"
                width={100}
                height={100}
                style={{ width: "100px", height: "100px" }}
              />
            </div>
            <div>
              <p className="text-xl font-bold">GitLab</p>
              <p>UserName : {labNickName}</p>
              <p>
                Token 등록:{" "}
                {isLabToken ? (
                  "토큰 등록 완료되었습니다"
                ) : (
                  <Link
                    className={AccessButton}
                    href="https://lab.ssafy.com/-/user_settings/personal_access_tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    토큰 발급 링크
                  </Link>
                )}
              </p>
            </div>
          </div>
          <div className="max-w-52">
            <button
              className="bg-white hover:bg-appGrey2 border shadow-lg rounded-t-xl p-4 flex gap-2 w-full"
              onClick={handleGitLabLogin}
            >
              <Image
                src="/image/oauth/gitlab-mark.svg"
                alt="githubSSO"
                width={24}
                height={24}
                style={{ width: "24px", height: "24px" }}
              />
              Sign in with GitLab
            </button>
            <button
              className=" bg-appGrey1 hover:bg-appGrey2 border shadow-lg rounded-b-xl px-4 py-2 flex gap-2 w-full"
              onClick={() => {
                setGitlabTokenModal(!gitlabTokenModal);
              }}
            >
              <Image
                src="/image/oauth/gitlab-mark.svg"
                alt="githubSSO"
                width={24}
                height={24}
                style={{ width: "24px", height: "24px" }}
              />
              access token 등록
            </button>
          </div>
          {gitlabTokenModal ? (
            <div className="absolute">
              <label className="card flex flex-col gap-2">
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Image
                      src="/image/oauth/gitlab-mark.svg"
                      alt="githubSSO"
                      width={24}
                      height={24}
                      style={{ width: "24px", height: "24px" }}
                    />
                    access token 등록
                  </div>
                  <Link
                    className={AccessButton}
                    href="https://lab.ssafy.com/-/user_settings/personal_access_tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    토큰 발급 링크
                  </Link>
                  <button
                    onClick={() => {
                      setGitlabTokenModal(false);
                    }}
                  >
                    <CloseIcon />
                  </button>
                </div>
                <div>
                  <input
                    type="password"
                    autoComplete="off"
                    className="py-1 px-2 bg-appGrey1 rounded-l-xl"
                    value={gitlabToken}
                    onChange={(e) => setGitlabToken(e.target.value)}
                  />
                  <button
                    className="py-1 px-2 bg-appGreen rounded-r-xl"
                    onClick={saveAccessTokenGitLab}
                  >
                    Token 등록
                  </button>
                </div>
              </label>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

const Header = `
  w-full
  flex
  justify-between
  items-center
  gap-4
  p-4
  bg-white
  shadow-lg
  rounded-t-xl
`;

const ButtonGroup = `
  flex
  gap-4
`;

const AccessButton = `
  inline-flex
  items-center
  justify-center
  px-1
  border-1-black
  border
  text-base
  font-medium
  rounded-md
  text-white
  bg-appBlue1
  hover:bg-opacity-75
`;

const Button = `
  inline-flex
  items-center
  justify-center
  px-2
  py-1
  border
  border-transparent
  text-base
  font-medium
  rounded-md
  text-white
  bg-black
  hover:bg-opacity-75
`;
