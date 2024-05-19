import React, { useEffect, useState } from "react";

import { ApiResponse, Contribution } from "@/api/userPage/apiContributions";
import ChartCalendar from "./CalendarChart";
import Image from "next/image";
import { useRouter } from "next/navigation";
import calendarStore from "@/store/calendar";

const CalendarCard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { githubData, gitlabData, mergeData, category, setCategory } =
    calendarStore();
  // github에서 contributions(잔디) 가져오기
  const [totalContribution, setTotalContribution] = useState<Record<
    string,
    number
  > | null>(null);
  const [dataByYear, SetDataByYear] = useState<Record<string, Contribution[]>>(
    {},
  );
  const [years, setYears] = useState<string[]>(["2024"]);
  const [data, setData] = useState<Contribution[]>([]);
  const [isActive, setIsActive] = useState("2024");
  const router = useRouter();

  const fitData = (res: ApiResponse) => {
    setIsLoading(true);
    // res와 res.total이 존재하는지 확인
    if (res && res.total && res.contributions) {
      setTotalContribution(res.total);
      // data를 년도별로 분류
      const dataByYear = res.contributions.reduce(
        (acc, contribution) => {
          const year = new Date(contribution.date).getFullYear();
          if (!acc[year]) {
            acc[year] = [];
          }
          acc[year].push(contribution);
          return acc;
        },
        {} as Record<string, Contribution[]>,
      );
      SetDataByYear(dataByYear);
      const keys = Object.keys(dataByYear);
      setYears(keys);
      const lastIndex = keys.length - 1;
      const firstKey = keys[lastIndex];
      setData(dataByYear[firstKey]);
      setIsActive(firstKey);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (category === 0) {
      if (githubData !== null) {
        fitData(githubData);
      }
    } else if (category === 1) {
      if (gitlabData !== null) {
        fitData(gitlabData);
      }
    } else if (category === 2) {
      if (mergeData !== null) {
        fitData(mergeData);
      }
    } else if (category === 3) {
      setIsLoading(true);
    }
  }, [category]);

  const handleYear = (year: string) => {
    setData(dataByYear[year]);
    setIsActive(year);
  };

  return (
    <section className="card">
      <ul className="flex gap-2 items-center">
        <li onClick={() => setCategory(2)}>
          <button
            className={`p-3 rounded-md hover:bg-appBlue1 ${category === 2 ? `bg-appBlue2` : `bg-appGrey2`}`}
            onClick={() => setCategory(2)}
          >
            Total
          </button>
        </li>
        <li>
          <button
            className={`p-2 rounded-xl hover:bg-appBlue1 ${category === 0 ? `bg-appBlue2` : `bg-appGrey2`}`}
            onClick={() => setCategory(0)}
          >
            <Image
              src="/image/oauth/github-mark.svg"
              alt="github"
              width={32}
              height={32}
              style={{ width: "32px", height: "32px" }}
            />
          </button>
        </li>
        <li>
          <button
            className={`p-2 rounded-xl hover:bg-appBlue1 ${category === 1 ? `bg-appBlue2` : `bg-appGrey2`}`}
            onClick={() => setCategory(1)}
          >
            <Image
              src="/image/oauth/gitlab-mark.svg"
              alt="github"
              width={32}
              height={32}
              style={{ width: "32px", height: "32px" }}
            />
          </button>
        </li>
      </ul>
      {isLoading && category === 3 ? (
        <section className="">
          <p className="text-lg h-10 py-2">Loading...</p>
          <div className="w-full aspect-[53/9] bg-appGrey1">
            Loading Chart...
          </div>
        </section>
      ) : (
        <>
          {category === 2 && mergeData === null ? (
            <section className="">
              <p className="text-lg h-10 py-2">
                Github, Gitlab 계정을 연동해주세요
              </p>
              <button
                className="w-full aspect-[53/9] bg-appGrey1 hover:bg-appBlue1 rounded-xl"
                onClick={() => router.push("/auth/link")}
              >
                연동 페이지로 이동
              </button>
            </section>
          ) : category === 0 && githubData === null ? (
            <section className="">
              <p className="text-lg h-10 py-2">Github 계정을 연동해주세요</p>
              <button
                className="w-full aspect-[53/9] bg-appGrey1 hover:bg-appBlue1 rounded-xl"
                onClick={() => router.push("/auth/link")}
              >
                연동 페이지로 이동
              </button>
            </section>
          ) : category === 1 && gitlabData === null ? (
            <section className="">
              <p className="text-lg h-10 py-2">Gitlab 계정을 연동해주세요</p>
              <button
                className="w-full aspect-[53/9] bg-appGrey1 hover:bg-appBlue1 rounded-xl"
                onClick={() => router.push("/auth/link")}
              >
                연동 페이지로 이동
              </button>
            </section>
          ) : totalContribution === null ? (
            <>
              <div>error</div>
            </>
          ) : (
            <>
              <div className="flex gap-2 items-center py-2">
                <p className="text-lg">
                  total:
                  {Object.values(totalContribution).reduce((a, b) => a + b, 0)}
                </p>
                <ul className="flex gap-2">
                  {Object.entries(totalContribution)
                    .sort(([a], [b]) => b.localeCompare(a)) // 키를 기준으로 오름차순 정렬
                    .map(([key, value]) => (
                      <li
                        key={key}
                        className={`px-4 py-2 rounded-md hover:bg-appBlue1 ${isActive === key ? "bg-appBlue2" : "bg-appGrey2"}`}
                        onClick={() => handleYear(key)}
                      >
                        {key}: {value}
                      </li>
                    ))}
                </ul>
              </div>
              <ChartCalendar data={data} category={category} />
            </>
          )}
        </>
      )}
    </section>
  );
};

export default CalendarCard;
