import React, { useEffect, useState } from "react";

import {
  Contribution,
  getContributions,
} from "@/api/userPage/apiContributions";
import userStore from "@/store/user";
import ChartCalendar from "./CalendarChart";

const CalendarCard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
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

  // github에서 contributions(잔디) 가져오기
  useEffect(() => {
    console.log("달력 차트 memberUuid");
    // console.log(memberUuid);
    const fetchData = async () => {
      const res = await getContributions(userName!);
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
    };
    if (userName !== null) {
      fetchData();
    }
  }, []);

  const handleYear = (year: string) => {
    setData(dataByYear[year]);
    setIsActive(year);
  };

  return isLoading ? (
    <section className="card">
      <p className="text-lg h-10">Loading...</p>
      <div className="w-full aspect-[53/7] bg-appGrey1">Loading Chart...</div>
    </section>
  ) : (
    <section className="card">
      <div className="flex gap-2 items-center">
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
      <ChartCalendar data={data} />
    </section>
  );
};

export default CalendarCard;
