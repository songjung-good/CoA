"use client";

import Image from "next/image";
import userStore from "@/store/user";
import EditIconDark from "@/icons/EditIconDark";
import UseAxios from "@/api/common/useAxios";
import { useEffect, useState } from "react";
import { colorMapping } from "@/components/colorMap";
import useCommonCodeStore from "@/store/commoncode";
import MyInfoEditCard from "./MyInfoEditCard";
import IsStar from "./IsStar";

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

interface ApiResponse {
  result: Member;
}

export default function MyUserCard({ uuid }: { uuid: string }) {
  const { UUID, AuthUserName, userImage } = userStore();
  const { response } = useCommonCodeStore.getState();
  const [myData, setMyData] = useState<Member>();
  const [isEdit, setIsEdit] = useState(false);
  const getMyData = async () => {
    try {
      // console.log(UUID);
      const getResponse = await UseAxios().get<ApiResponse>(
        `/api/member/${uuid}`,
      );
      // console.log(getResponse.data.result);
      setMyData(getResponse.data.result);
    } catch (error) {
      console.error(`/api/member/${uuid} 요청 에러`, error);
    }
  };
  useEffect(() => {
    if (uuid !== "") {
      getMyData();
    }
  }, [uuid]);

  const closeEdit = () => {
    setIsEdit(false);
  };

  return (
    <>
      <section className="card flex flex-col gap-4 relative">
        <div className="flex flex-row gap-4">
          <div className="flex flex-col items-center relative">
            <div className="absolute top-0 left-0">
              {myData &&
                (myData?.isMine ? (
                  <button
                    aria-label="유저정보 수정하기"
                    onClick={() => {
                      setIsEdit(!isEdit);
                    }}
                  >
                    <EditIconDark />
                  </button>
                ) : (
                  <IsStar
                    isBookmark={myData?.isBookmark}
                    Uuid={myData?.memberUuid}
                  />
                ))}
            </div>
            <div className="rounded-full overflow-hidden w-36 h-36">
              <img
                src={myData?.memberImg || userImage}
                alt="logo"
                width={144}
                height={144}
              />
            </div>
            <p className="text-lg">{myData?.memberNickName || AuthUserName}</p>
            <p>
              포지션{"  "}
              {response?.result?.commonCodeList[2]?.codes &&
                response.result.commonCodeList[2].codes[
                  `${myData?.memberJobCodeId}`
                ]}
            </p>
          </div>
          <div className="grow flex flex-col gap-2">
            {/* 자기소개 란 */}
            <div className="bg-appGrey1 p-4 rounded-2xl grow">
              <p>{myData?.memberIntro}</p>
            </div>

            <div className="relative flex items-center">
              <div className="">
                <p>기술스택</p>
                <ul className="flex flex-wrap gap-2 p-1">
                  {myData?.skillList.map((skill) => (
                    <li
                      key={skill.codeId}
                      style={{
                        padding: "4px",
                        borderRadius: "9999px",
                        backgroundColor: `${colorMapping[skill.codeName]}`,
                      }}
                    >
                      <p className="px-1 text-white ">{skill.codeName}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {isEdit && (
          <MyInfoEditCard
            intro={myData?.memberIntro || ""}
            skills={myData?.skillList || []}
            jop={myData?.memberJobCodeId.toString() || ""}
            closeEdit={closeEdit}
            setMyData={setMyData}
          />
        )}
      </section>
    </>
  );
}
