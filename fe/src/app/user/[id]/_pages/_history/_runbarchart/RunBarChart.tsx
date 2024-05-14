import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import repositoryStore from "@/store/repos";
import { mergeLanguageData } from "./mergeLOC";
import { colorMapping } from "../../../../../../components/colorMap";

type LanguageData = {
  language: string;
  value: number;
};

type TransformedData = {
  date: string;
  languages: LanguageData[];
};

const RunBarChart: React.FC = () => {
  const { repos } = repositoryStore((state) => state);
  //차트
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<TransformedData[]>([]);
  const [prevData, setPrevData] = useState<LanguageData[]>([]);
  // 데이터 변환
  let transformedData: TransformedData[] = [];
  useEffect(() => {
    transformedData = [];
    repos.forEach((repo) => {
      // createdAt와 pushedAt을 월별 차이 구하기
      const createdAt = new Date(repo.createdAt);
      const pushedAt = new Date(repo.pushedAt);
      const startMonth = [createdAt.getFullYear(), createdAt.getMonth() + 1];
      const endMonth = [pushedAt.getFullYear(), pushedAt.getMonth() + 1];
      const monthDiff =
        (endMonth[0] - startMonth[0]) * 12 + (endMonth[1] - startMonth[1]);
      if (monthDiff === 0) {
        const languages = [];
        for (const [key, value] of Object.entries(repo.languages)) {
          languages.push({
            language: key,
            value: value,
          });
        }
        transformedData.push({
          date: `${startMonth[0]}-${startMonth[1]}`,
          languages: languages,
        });
      } else {
        // 프로젝트 기간(월) 만큼 value 나눠서 넣기
        for (let i = 0; i < monthDiff; i++) {
          const languages = [];
          for (const [key, value] of Object.entries(repo.languages)) {
            languages.push({
              language: key,
              value: Math.floor(value / monthDiff),
            });
          }
          transformedData.push({
            date: `${startMonth[0]}-${startMonth[1]}`,
            languages: languages,
          });
        }
      }
    });

    //월 단위로 데이터 합치기
    const mergeData = mergeLanguageData(transformedData);
    // console.log("mergeData");
    // console.log(mergeData);
    setData(mergeData);
  }, [repos]);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    const svgWidth = svgRef.current.getBoundingClientRect().width;
    const duration = 1000;
    const margin = {
      top: 20,
      bottom: 20,
      left: 100,
      right: 28,
    };
    const svgHeight = 400;
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;
    svg.attr("height", svgHeight);

    const updateChart = (index: number) => {
      const chartDate = data[index].date;
      const newData = [...prevData, ...data[index].languages];
      // 데이터를 크기순으로 정렬
      const sortedData = newData.sort((a, b) => b.value - a.value);
      const currentData = sortedData.reduce((acc: LanguageData[], cur) => {
        const existingLanguage = acc.find(
          (item: LanguageData) => item.language === cur.language,
        );

        if (existingLanguage) {
          existingLanguage.value += cur.value;
        } else {
          acc.push({ ...cur });
        }

        return acc;
      }, []);
      setPrevData(JSON.parse(JSON.stringify(currentData)));

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
        .range([0, height])
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
      //날짜 추가
      svg
        .select(".date")
        .text(chartDate)
        .attr("transform", `translate(${width + margin.left - 20}, ${height})`)
        .attr("text-anchor", "end")
        .style("font-size", "24px"); // 텍스트 크기 설정
      // .style("fill", "red");
      //bars 설정
      const bars = svg
        .selectAll(".bar")
        .data(currentData, (d: any) => d.language);
      //기존 bar 제거
      bars
        .exit()
        .transition()
        .duration(duration)
        .attr("width", margin.left)
        .remove();
      //bar 추가
      bars
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("fill", (d) => colorMapping[d.language] || "steelblue")
        .attr("x", margin.left)
        .attr("y", (d) => y(d.language)! + margin.top)
        .attr("width", 0)
        .attr("height", y.bandwidth())
        .transition()
        .duration(duration)
        .attr("width", (d) => x(d.value));
      //언어 이름 추가
      bars
        .transition()
        .duration(duration)
        .attr("y", (d) => y(d.language)! + margin.top)
        .attr("width", (d) => x(d.value))
        .attr("height", y.bandwidth());
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
    <svg className="w-full" ref={svgRef}>
      <g className="x-axis" />
      <g className="y-axis" />
      <text className="date" />
    </svg>
  );
};

export default RunBarChart;
