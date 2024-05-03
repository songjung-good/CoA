import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import repositoryStore from "@/store/repos";

type LanguageData = {
  language: string;
  value: number;
};

type TransformedData = {
  date: string;
  languages: LanguageData[];
};

function toYearMonthString(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더합니다.
  return `${year}-${month.toString().padStart(2, "0")}`; // 월이 한 자리 수인 경우 앞에 0을 추가합니다.
}

const RunBarChart: React.FC = () => {
  const { repos } = repositoryStore((state) => state);
  //차트
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<TransformedData[]>([]);
  // 데이터 변환
  let transformedData: TransformedData[] = [];
  useEffect(() => {
    transformedData = [];
    // 프로젝트 데이터를 순회하면서 각 프로젝트의 createdAt와 pushedAt 사이의 날짜 범위를 계산하고 집계
    repos.forEach((repo) => {
      // createdAt와 pushedAt을 Date 객체로 변환
      const createdAt = new Date(repo.createdAt);
      const pushedAt = new Date(repo.pushedAt);

      // 월별로 사용된 언어와 라인 수를 집계
      const startMonth = new Date(
        createdAt.getFullYear(),
        createdAt.getMonth(),
        1,
      );
      const endMonth = new Date(
        pushedAt.getFullYear(),
        pushedAt.getMonth() + 1,
        0,
      );
      const startYear = startMonth.getFullYear();
      const endYear = endMonth.getFullYear();

      const startMonthIndex = startMonth.getMonth();
      const endMonthIndex = endMonth.getMonth();

      const monthDiff = Math.max(
        (endYear - startYear) * 12 + (endMonthIndex - startMonthIndex),
        1,
      ); // 0으로 나누지 않도록 1로 설정

      // 프로젝트의 사용된 언어와 라인 수를 순회하면서 변환된 데이터에 추가
      for (
        let date = startMonth;
        date <= endMonth;
        date.setMonth(date.getMonth() + 1)
      ) {
        // const dateString = date.
        const dateString = toYearMonthString(date);
        const languageEntries = Object.entries(repo.languages).map(
          ([language, value]) => ({
            language,
            value: Math.floor(value / monthDiff),
          }),
        );
        // 월별 data 통합
        const existingDataIndex = transformedData.findIndex(
          (data) => data.date === dateString,
        );
        if (existingDataIndex !== -1) {
          languageEntries.forEach(({ language, value }) => {
            const existingLanguageIndex = transformedData[
              existingDataIndex
            ].languages.findIndex((langData) => langData.language === language);
            //언어가 있으면 더 하기 없으면 언어 obj 생성
            if (existingLanguageIndex !== -1) {
              transformedData[existingDataIndex].languages[
                existingLanguageIndex
              ].value += value;
            } else {
              transformedData[existingDataIndex].languages.push({
                language,
                value,
              });
            }
          });
        } else {
          transformedData.push({
            date: dateString,
            languages: languageEntries,
          });
        }
      }
    });

    transformedData.sort((a, b) => a.date.localeCompare(b.date));
    // 이전 월, 현재 월의 합치기

    console.log("transformedData");
    console.log(transformedData);
    setData(transformedData);
  }, [repos]);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    const svgWidth = svgRef.current.getBoundingClientRect().width;
    const duration = 1000;
    const margin = {
      top: 20,
      bottom: 20,
      left: 80,
      right: 28,
    };
    const width = svgWidth - margin.left - margin.right;

    const updateChart = (index: number) => {
      const currentData = data[index].languages;

      const x = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(currentData, (d) => (d.value ? d.value : 0)) as number,
        ])
        .range([0, width]);

      const y = d3
        .scaleBand()
        .domain(currentData.map((d) => d.language))
        .range([0, 200])
        .padding(0.1);

      const yAxis = d3.axisLeft(y);
      const xAxis = d3.axisTop(x);

      svg
        .select(".y-axis")
        .transition()
        .duration(duration)
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call((g) => yAxis(g as any));
      svg
        .select(".x-axis")
        .transition()
        .duration(duration)
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call((g) => xAxis(g as any));

      const bars = svg
        .selectAll(".bar")
        .data(currentData, (d: any) => d.language);

      bars
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("fill", "steelblue")
        .attr("x", margin.left)
        .attr("y", (d) => y(d.language)! + margin.top)
        .attr("width", 0)
        .attr("height", y.bandwidth())
        .transition()
        .duration(duration)
        .attr("width", (d) => x(d.value));

      bars
        .transition()
        .duration(duration)
        .attr("y", (d) => y(d.language)! + margin.top)
        .attr("width", (d) => x(d.value))
        .attr("height", y.bandwidth());

      bars
        .exit()
        .transition()
        .duration(duration)
        .attr("width", margin.left)
        .remove();
    };

    updateChart(currentIndex);

    const interval = setInterval(() => {
      if (currentIndex < data.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        updateChart(currentIndex);
      }
    }, duration);

    return () => clearInterval(interval);
  }, [data, currentIndex]);

  return (
    <svg className="w-full h-[800px]" ref={svgRef}>
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
  );
};

export default RunBarChart;
