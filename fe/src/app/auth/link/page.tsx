"use client";

import { useState, useEffect } from "react";

import UseAxios from "@/api/common/useAxios";
import Image from "next/image";
import CloseIcon from "@/icons/CloseIcon";

export default function LinkPage() {
  const serverUrl = process.env.NEXT_PUBLIC_URL_SERVER;
  // 토큰 입력 모달
  const [githubTokenModal, setGithubTokenModal] = useState(false);
  const [gitlabTokenModal, setGitlabTokenModal] = useState(false);
  // 입력 받을 변수
  const [githubToken, setGithubToken] = useState("");
  const [gitlabToken, setGitlabToken] = useState("");
  const [solvedacNickName, setSolvedacNickName] = useState("");
  const [codeforcesNickName, setCodeforcesNickName] = useState("");

  // 반환 받을 변수
  const [hubNickName, setHubNickName] = useState("");
  const [labNickName, setLabNickName] = useState("");
  const [isHubToken, setIsHubToken] = useState("");
  const [isLabToken, setIsLabToken] = useState("");

  const [sacNickName, setSacNickName] = useState("");
  const [cofNickName, setCofNickName] = useState("");

  const axiosInstance = UseAxios();

  // fetchData 함수 정의
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("api/accountLink");

      console.log(response.data);
      console.log(response.data.result);
      const getData = response.data.result;

      setHubNickName(getData.githubNickName);
      setIsHubToken(getData.isGithubToken);

      setLabNickName(getData.gitlabNickName);
      setIsLabToken(getData.isGitlabToken);

      setSacNickName(getData.solvedacNickName);
      setCofNickName(getData.codeforcesNickName);
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
    } catch (error) {
      console.error("Gitlab Token 저장 중 오류가 발생했습니다:", error);
    }
  };

  const saveNickNameSolvedac = async () => {
    try {
      const response = await axiosInstance.post("/api/accountLink/solvedac", {
        nickName: solvedacNickName,
      });
      setSacNickName(response.data.result);
      setSolvedacNickName("");
    } catch (error) {
      console.error("saveNickNameSolvedac 저장 중 오류가 발생했습니다:", error);
    }
  };
  const saveNickNameCodeforces = async () => {
    try {
      const response = await axiosInstance.post("/api/accountLink/codeforces", {
        nickName: codeforcesNickName,
      });
      setCofNickName(response.data.result);
      setCodeforcesNickName("");
    } catch (error) {
      console.error(
        "saveNickNameCodeforces 저장 중 오류가 발생했습니다:",
        error,
      );
    }
  };
  return (
    <main className="bg-appGrey1  flex flex-col items-center">
      <div className="max-w-screen-xl w-full flex flex-col py-4 gap-4">
        <h1 className="text-xl font-bold">계정 연동하기</h1>
        <section className="card flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <div>
              <Image
                src="/image/oauth/github-mark.svg"
                alt="github"
                width={100}
                height={100}
              />
            </div>
            <div>
              <p className="text-xl font-bold">GitHub</p>
              <p>UserName : {hubNickName}</p>
              <p>Token 등록: {isHubToken}</p>
            </div>
          </div>
          <div>
            <button
              className="bg-white hover:bg-appGrey2 border shadow-lg rounded-t-xl p-4  flex gap-2"
              onClick={handleGithubLogin}
            >
              <Image
                src="/image/githubSSO.png"
                alt="githubSSO"
                width={24}
                height={24}
              />
              Sign in with GitHub
            </button>
            <button
              className=" bg-appGrey1 hover:bg-appGrey2 border shadow-lg rounded-b-xl px-4 py-2 flex gap-2 w-full"
              onClick={() => {
                setGithubTokenModal(!githubTokenModal);
              }}
            >
              <Image
                src="/image/githubSSO.png"
                alt="githubSSO"
                width={24}
                height={24}
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
                      src="/image/githubSSO.png"
                      alt="githubSSO"
                      width={24}
                      height={24}
                    />
                    access token 등록
                  </div>
                  <button
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
                    className="py-1 px-2 bg-appGrey1 rounded-l-xl"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                  />
                  <button
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
              />
            </div>
            <div>
              <p className="text-xl font-bold">GitLab</p>
              <p>UserName : {labNickName}</p>
              <p>Token 등록: {isLabToken}</p>
            </div>
          </div>
          <div>
            <button
              className="bg-white hover:bg-appGrey2 border shadow-lg rounded-t-xl p-4 flex gap-2"
              onClick={handleGitLabLogin}
            >
              <Image
                src="/image/oauth/gitlab-mark.svg"
                alt="githubSSO"
                width={24}
                height={24}
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
                    />
                    access token 등록
                  </div>
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
        {/* solvedAC */}
        <section className="card flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <div>
              <Image
                src="/image/oauth/solvedAC.svg"
                alt="github"
                width={100}
                height={100}
              />
            </div>
            <div>
              <p className="text-xl font-bold">solvedAC</p>
              <p>UserName : {sacNickName}</p>
            </div>
          </div>
          <div>
            <label className="bg-white hover:bg-appGrey2 border shadow-lg rounded-xl p-4 flex flex-col gap-2">
              <div className="flex gap-2">
                <Image
                  src="/image/oauth/solvedAC.svg"
                  alt="githubSSO"
                  width={24}
                  height={24}
                />
                solved.ac 닉네임
              </div>
              <div>
                <input
                  type="text"
                  className="bg-appGrey1 rounded-l-xl py-1 px-2 w-40"
                  value={solvedacNickName}
                  onChange={(e) => setSolvedacNickName(e.target.value)}
                />
                <button
                  className="bg-appGreen rounded-r-xl py-1 px-2"
                  onClick={saveNickNameSolvedac}
                >
                  등록
                </button>
              </div>
            </label>
          </div>
        </section>
        {/* Codeforces */}
        <section className="card flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <div>
              <Image
                src="/image/oauth/CodeForces.svg"
                alt="github"
                width={100}
                height={100}
              />
            </div>
            <div>
              <p className="text-xl font-bold">Codeforces</p>
              <p>UserName : {cofNickName}</p>
            </div>
          </div>
          <div>
            <label className="bg-white hover:bg-appGrey2 border shadow-lg rounded-xl p-4 flex flex-col gap-2">
              <div className="flex gap-2">
                <Image
                  src="/image/oauth/CodeForces.svg"
                  alt="githubSSO"
                  width={24}
                  height={24}
                />
                solved.ac 닉네임
              </div>
              <div>
                <input
                  type="text"
                  className="bg-appGrey1 rounded-l-xl py-1 px-2 w-40"
                  value={codeforcesNickName}
                  onChange={(e) => setCodeforcesNickName(e.target.value)}
                />
                <button
                  className="bg-appGreen rounded-r-xl py-1 px-2"
                  onClick={saveNickNameCodeforces}
                >
                  등록
                </button>
              </div>
            </label>
          </div>
        </section>
      </div>
    </main>
  );
}
