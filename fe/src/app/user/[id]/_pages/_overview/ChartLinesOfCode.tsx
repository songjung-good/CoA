import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { colorMapping } from "../../_components/colorMap";
import repositoryStore from "@/store/repos";

const ChartLinesOfCode = () => {
  // data 양식
  // const data1 = [
  //   { language: "JavaScript", lines: 298655 },
  //   { language: "Vue", lines: 32934 },
  // ];
  const obj = repositoryStore((state) => state.languageTotals);
  const data1 = Object.entries(obj).map(([language, lines]) => ({
    language,
    lines,
  }));
  const totallines = data1.reduce((sum, item) => sum + item.lines, 0);

  // Chart svg 만들기
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    // Specify the chart’s dimensions, based on a bar’s height.
    const barHeight = 25;
    const marginTop = 30;
    const marginRight = 0;
    const marginBottom = 10;
    const marginLeft = 64;
    const svgWidth = svgRef.current.getBoundingClientRect().width;
    const width = svgWidth;
    const height =
      Math.ceil((data1.length + 0.1) * barHeight) + marginTop + marginBottom;

    // Create the scales.
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data1, (d) => d.lines) as number])
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleBand()
      .domain(d3.sort(data1, (d) => -d.lines).map((d) => d.language))
      .rangeRound([marginTop, height - marginBottom])
      .padding(0.1);

    // Create the SVG container.
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");
    //중복생성방지
    svg.selectAll("g").remove();
    // Append a rect for each language.
    svg
      .append("g")
      .attr("fill", "steelblue")
      .selectAll()
      .data(data1)
      .join("rect")
      .attr("x", x(0))
      .attr("y", (d) => y(d.language)!)
      .attr("width", (d) => (d.lines / totallines) * width)
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorMapping[d.language]); // 색상 지정

    // Append a label for each language.
    svg
      .append("g")
      .attr("fill", "white")
      .attr("text-anchor", "end")
      .selectAll()
      .data(data1)
      .join("text")
      .attr("x", (d) => (d.lines / totallines) * width)
      .attr("y", (d) => y(d.language)! + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("dx", (d) => d.lines.toString().length * 10 + marginLeft)
      .text((d) => d.lines)
      .attr("fill", "black");
    // .attr("text-anchor", "start");
    // Create the axes

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0));
  }, []);
  return <svg className="w-full" ref={svgRef}></svg>;
};

export default ChartLinesOfCode;
