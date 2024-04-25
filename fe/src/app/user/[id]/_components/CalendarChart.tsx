import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  Contribution,
  getContributions,
} from "@/api/userPage/apiContributions";

const CalendarChart: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // github에서 contributions(잔디) 가져오기
  const [totalContribution, setTotalContribution] = useState<
    Record<string, number>
  >({ "2024": 200 });
  const [dataByYear, SetDataByYear] = useState<Record<string, Contribution[]>>(
    {},
  );
  const [data, setData] = useState<Contribution[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getContributions();
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
      const firstKey = Object.keys(dataByYear)[0];
      setData(dataByYear[firstKey]);

      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Chart svg 만들기
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const svgWidth = svgRef.current.getBoundingClientRect().width;
    const cellSize = svgWidth / 53;
    const width = cellSize * 53;
    const height = cellSize * 7;
    const colorRange: string[] = [
      "#ebedf0",
      "#9be9a8",
      "#40c463",
      "#30a14e",
      "#216e39",
    ];
    const color = d3.scaleQuantize([0, 4], colorRange);

    const dateExtent = d3.extent(data, (d) => new Date(d.date));
    const startDate = dateExtent[0] as Date;
    const endDate = dateExtent[1] as Date;

    const xScale = d3
      .scaleTime()
      .domain([startDate, d3.timeDay.offset(endDate, 1)])
      .range([0, width]);

    svg
      .attr("width", width)
      .attr("height", height)
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr("x", (_, i) => Math.floor(i / 7) * cellSize)
      .attr("y", (_, i) => (i % 7) * cellSize)
      .attr("fill", (d) => color(d.level))
      .attr("stroke", "#fff");
  }, [data]);

  return isLoading ? (
    <p>Loading</p>
  ) : (
    <section className="m-4 p-4 bg-appGrey1 rounded-2xl">
      <div className="flex gap-2 items-center">
        <p className="text-lg">
          total: {Object.values(totalContribution).reduce((a, b) => a + b)}
        </p>
        <ul className="flex gap-2">
          {Object.entries(totalContribution).map(([key, value]) => (
            <li key={key} className="px-4 py-2 bg-appGrey2 rounded-md">
              {key}: {value}
            </li>
          ))}
        </ul>
      </div>
      <svg className="w-full" ref={svgRef}></svg>
    </section>
  );
};

export default CalendarChart;
