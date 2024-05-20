"use client";

import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import tw from "tailwind-styled-components";
import Image from "next/image";
import { useStore } from "zustand";
import GitlabRepo from "@/app/main/GitlabRepo";
import GithubRepo from "@/app/main/GithubRepo";
import UserProfile from "@/components/maincomponents/UserProfile";
import userStore from "@/store/user";

export default function GitRepoList() {
  const githubUserName = useStore(userStore).githubUserName;
  const isGithubToken = useStore(userStore).isGithubToken;
  const gitlabUserName = useStore(userStore).gitlabUserName;
  const isGitlabToken = useStore(userStore).isGitlabToken;

  const [tabIndex, setTabIndex] = useState(0);

  const handleSwipe = (eventData: any) => {
    if (eventData.dir === "Left" && tabIndex === 0) {
      setTabIndex(1);
    } else if (eventData.dir === "Right" && tabIndex === 1) {
      setTabIndex(0);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwiped: handleSwipe,
    // preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div
      {...swipeHandlers}
      className="w-full sm:w-1/3 flex flex-col mt-10 p-4 sm:ml-4 bg-white shadow-lg rounded-lg border min-h-[300px]"
    >
      <div className="flex justify-between my-2 mb-[8%]">
        <button
          onClick={() => {
            setTabIndex(0);
          }}
          className={tabIndex === 0 ? "font-medium text-base lg:text-lg border-b-2 border-black" : "hover:font-bold hover:border-appRed"}
        >
          Github
        </button>
        <H3 className="text-lg lg:text-2xl font-medium">내 레포 목록</H3>
        <button
          onClick={() => {
            setTabIndex(1);
          }}
          className={tabIndex === 1 ? "font-medium text-base lg:text-lg border-b-2 border-black" : "hover:font-bold hover:border-appRed"}
        >
          GitLab
        </button>
      </div>
      {tabIndex === 0 ? (
        <div className="select-none">
          {/* <Heading>
            <Image
              src="/image/oauth/github-mark.svg"
              alt="github logo"
              width={30}
              height={30}
              className="mr-2"
            />
            GitHub
          </Heading> */}
          <GithubRepo userID={githubUserName} isToken={isGithubToken} />
        </div>
      ) : (
        <div className="select-none">
          {/* <Heading>
            <Image
              src="/image/oauth/gitlab-mark.svg"
              alt="github"
              width={30}
              height={30}
              className="mr-2"
            />
            GitLab
          </Heading> */}
          <GitlabRepo userID={gitlabUserName} isToken={isGitlabToken} />
        </div>
      )}
    </div>
  );
}

const H3 = tw.h3`
  
`

const Heading = tw.h2`
  font-Regular
  text-lg sm:text-xl md:text-2xl
  flex
  items-center
  justify-center
  my-2
  select-none
`;
