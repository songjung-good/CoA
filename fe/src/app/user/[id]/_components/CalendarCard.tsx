import React, { useEffect, useState } from "react";

import {
  ApiResponse,
  Contribution,
  getContributions,
  getGithubEventsData,
  getGitlabEventsData,
} from "@/api/userPage/apiContributions";
import userStore from "@/store/user";
import ChartCalendar from "./CalendarChart";
import { mergeCalendarData } from "./mergeEvents";

const CalendarCard = ({ uuid }: { uuid: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [githubData, setGithubData] = useState<ApiResponse>();
  const [gitlabData, setGitlabData] = useState<ApiResponse>();
  const [mergeData, setMergeData] = useState<ApiResponse>();
  const userName = userStore((state) => state.githubUserName);
  // github에서 contributions(잔디) 가져오기
  const [totalContribution, setTotalContribution] = useState<
    Record<string, number>
  >({ "2024": 200 });
  const [dataByYear, SetDataByYear] = useState<Record<string, Contribution[]>>(
    {},
  );
  const [years, setYears] = useState<string[]>(["2024"]);
  const [data, setData] = useState<Contribution[]>([]);
  const [isActive, setIsActive] = useState("2024");
  const [category, setCategory] = useState(0);
  // github에서 contributions(잔디) 가져오기
  const fetchData = async () => {
    // const res = await getContributions(userName!);
    setIsLoading(true);
    const res1 = await getGithubEventsData(uuid);
    const res2 = await getGitlabEventsData(uuid);
    const res3 = await mergeCalendarData(res1, res2);
    setGithubData(res1);
    setGitlabData(res2);
    setMergeData(res3);
    fitData(res1);
    console.log("res1");
    console.log(res1);
    console.log("res2");
    console.log(res2);
    console.log("res3");
    console.log(res3);
  };

  const fitData = (res: ApiResponse) => {
    // res와 res.total이 존재하는지 확인
    if (res && res.total) {
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
      setYears(Object.keys(dataByYear));
      const firstKey = Object.keys(dataByYear)[0];
      setData(dataByYear[firstKey]);
      setIsActive(firstKey);

      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (category === 0) {
      if (githubData !== undefined) {
        fitData(githubData);
      }
    } else if (category === 1) {
      if (gitlabData !== undefined) {
        fitData(gitlabData);
      }
    } else if (category === 2) {
      if (mergeData !== undefined) {
        fitData(mergeData);
      }
    }
  }, [category]);

  const handleYear = (year: string) => {
    setData(dataByYear[year]);
    setIsActive(year);
  };

  return (
    <section className="card">
      <ul className="flex gap-2 items-center">
        <li>
          <button
            className={`px-4 py-1 rounded-md hover:bg-appBlue1 ${category === 0 ? `bg-appBlue2` : `bg-appGrey2`}`}
            onClick={() => setCategory(0)}
          >
            깃허브
          </button>
        </li>
        <li>
          <button
            className={`px-4 py-1 rounded-md hover:bg-appBlue1 ${category === 1 ? `bg-appBlue2` : `bg-appGrey2`}`}
            onClick={() => setCategory(1)}
          >
            깃랩
          </button>
        </li>
        <li onClick={() => setCategory(2)}>
          <button
            className={`px-4 py-1 rounded-md hover:bg-appBlue1 ${category === 2 ? `bg-appBlue2` : `bg-appGrey2`}`}
            onClick={() => setCategory(2)}
          >
            Total
          </button>
        </li>
      </ul>
      {isLoading ? (
        <section className="">
          <p className="text-lg h-10 py-2">Loading...</p>
          <div className="w-full aspect-[53/7] bg-appGrey1">
            Loading Chart...
          </div>
        </section>
      ) : (
        <>
          <div className="flex gap-2 items-center py-2">
            <p className="text-lg">
              total: {Object.values(totalContribution).reduce((a, b) => a + b)}
            </p>
            <ul className="flex gap-2">
              {Object.entries(totalContribution).map(([key, value]) => (
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
    </section>
  );
};

export default CalendarCard;
