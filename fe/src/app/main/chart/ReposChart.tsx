import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

import { colorMapping } from "@/components/colorMap";
import { getReposSkillsData } from "@/api/mainChart/skillCount";

interface SkillCount {
  codeName: string;
  cnt: number;
}

const ReposChart = () => {
  const [data1, setData] = useState<SkillCount[] | undefined>(undefined);
  const fetchData = async () => {
    const MembersSkillsData = await getReposSkillsData();
    const slicedData = MembersSkillsData.slice(0, 10);
    // const filteredData = MembersSkillsData.filter((item) => item.cnt !== 0);
    setData(slicedData);
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Chart svg 만들기
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (data1 === undefined) return;
    if (!svgRef.current) return;
    const totalLines = data1.reduce((sum, item) => sum + item.cnt, 0);
    const svg = d3.select(svgRef.current);
    // Specify the chart’s dimensions, based on a bar’s height.
    const barHeight = 24;
    const marginTop = 10;
    const marginRight = 0;
    const marginBottom = 10;
    const marginLeft = 100;
    const svgWidth = svgRef.current.getBoundingClientRect().width;
    const width = svgWidth;
    const height =
      Math.ceil((data1.length + 0.1) * barHeight) + marginTop + marginBottom;

    // Create the scales.
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data1, (d) => d.cnt) as number])
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleBand()
      .domain(d3.sort(data1, (d) => -d.cnt).map((d) => d.codeName))
      .rangeRound([marginTop, height - marginBottom])
      .padding(0.1);

    // Create the SVG container.
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");
    //중복생성방지
    // svg.selectAll("g").remove();
    // Append a rect for each language.
    svg
      .append("g")
      .attr("fill", "steelblue")
      .selectAll()
      .data(data1)
      .join("rect")
      .attr("x", x(0))
      .attr("y", (d) => y(d.codeName)!)
      .attr("width", (d) => (d.cnt / totalLines) * width)
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorMapping[d.codeName] || "steelblue"); // 색상 지정

    // Append a label for each language.
    svg
      .append("g")
      .attr("fill", "white")
      .attr("text-anchor", "end")
      .selectAll()
      .data(data1)
      .join("text")
      .attr("x", (d) => (d.cnt / totalLines) * width)
      .attr("y", (d) => y(d.codeName)! + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("dx", (d) => d.cnt.toString().length * 10 + marginLeft)
      .text((d) => d.cnt)
      .attr("fill", "black");
    // Create the axes
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0));
  }, [data1]);
  return (
    <section>
      <p className="pl-4 font-medium text-lg sm:text-xl md:text-2xl">
        프로젝트별 스킬 TOP 10
      </p>
      <svg className="w-full" ref={svgRef}></svg>
    </section>
  );
};

export default ReposChart;
