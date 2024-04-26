import * as d3 from "d3";
import { useEffect, useRef } from "react";

const ChartLinesOfCode = () => {
  const data1 = [
    { letter: "JavaScript", frequency: 298655 },
    { letter: "Vue", frequency: 32934 },
    { letter: "Java", frequency: 30654 },
    { letter: "Python", frequency: 15358 },
    { letter: "CSS", frequency: 12650 },
    { letter: "TypeScript", frequency: 10722 },
    { letter: "HTML", frequency: 6596 },
    { letter: "Shell", frequency: 3984 },
    { letter: "C++", frequency: 3098 },
    { letter: "Dart", frequency: 2485 },
    { letter: "Swift", frequency: 288 },
    { letter: "C", frequency: 256 },
    { letter: "Kotlin", frequency: 20 },
    { letter: "Objective-C", frequency: 4 },
  ];
  const totalFrequency = data1.reduce((sum, item) => sum + item.frequency, 0);
  const colorMapping: { [key: string]: string } = {
    JavaScript: "#F7DF1E",
    Python: "#3776AB",
    Java: "#B07219",
    CSS: "#1572B6",
    HTML: "#E34C26",
    TypeScript: "#007ACC",
    Swift: "#FFAC45",
    C: "#A8B9CC",
    "C++": "#00599C",
    Kotlin: "#F18E33",
    Dart: "#00B4AB",
    Shell: "#89E051",
    Vue: "#42B883",
    "Objective-C": "#438EFF",
    // 다른 코드 이름과 색상을 여기에 추가
  };
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
      .domain([0, d3.max(data1, (d) => d.frequency) as number])
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleBand()
      .domain(d3.sort(data1, (d) => -d.frequency).map((d) => d.letter))
      .rangeRound([marginTop, height - marginBottom])
      .padding(0.1);

    // Create a value format.
    const format = x.tickFormat(20, "%");

    // Create the SVG container.
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Append a rect for each letter.
    svg
      .append("g")
      .attr("fill", "steelblue")
      .selectAll()
      .data(data1)
      .join("rect")
      .attr("x", x(0))
      .attr("y", (d) => y(d.letter)!)
      .attr("width", (d) => (d.frequency / totalFrequency) * width)
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorMapping[d.letter]); // 색상 지정

    // Append a label for each letter.
    svg
      .append("g")
      .attr("fill", "white")
      .attr("text-anchor", "end")
      .selectAll()
      .data(data1)
      .join("text")
      .attr("x", (d) => (d.frequency / totalFrequency) * width)
      .attr("y", (d) => y(d.letter)! + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("dx", (d) => d.frequency.toString().length * 10 + marginLeft)
      .text((d) => d.frequency)
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
