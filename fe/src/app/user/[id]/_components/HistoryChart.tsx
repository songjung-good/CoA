import { ElementRef, useEffect, useRef } from "react";
import * as d3 from "d3";
import repositoryStore from "@/store/repos";
import { Repository } from "@/api/userPage/apiLinesOfCode";

export default function HistoryChart() {
  const repos = repositoryStore((state) => state.repos);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || repos.length === 0) return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    const margin = { top: 20, right: 24, bottom: 20, left: 24 };
    const svgWidth = svgRef.current.getBoundingClientRect().width;
    const width = svgWidth - margin.left - margin.right;
    const height = repos.length * 12 + margin.top + margin.bottom;
    svg.attr("width", svgWidth).attr("height", height);
    //중복생성방지
    svg.selectAll("g").remove();
    //x축 만들기
    //x축 범위 지정
    const dates = repos.flatMap((d) => [
      new Date(
        new Date(d.createdAt).getFullYear(),
        new Date(d.createdAt).getMonth(),
      ),
      new Date(
        new Date(d.updatedAt).getFullYear(),
        new Date(d.updatedAt).getMonth() + 1,
      ),
    ]);
    const x = d3
      .scaleTime()
      .domain(d3.extent(dates) as [Date, Date])
      .range([0, width]);
    //x축 틱 양식 지정
    const xAxis = d3
      .axisTop(x)
      .tickFormat((date) => d3.timeFormat("%Y-%m")(date as Date));
    // 위치 조정 밑 svg에 추가
    const g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 색상 척도 설정
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    // 툴팁 요소 생성
    tooltip
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");

    g.selectAll("g.rect-text-group")
      .data(repos)
      .enter()
      .append("g")
      .attr("class", "rect-text-group")
      .on("mouseover", function (event, d) {
        // 호버 시 테두리 추가
        d3.select(this)
          .select("rect")
          .attr("stroke", "blue")
          .attr("stroke-width", 1);

        // 툴팁 내용 설정
        const tooltipContent = `<strong>${d.name}</strong><br/>Created: ${d.createdAt.substring(0, 10)}<br/>pushed: ${d.pushedAt.substring(0, 10)}`;

        // tooltip을 보이도록 설정하고 내용을 채움
        tooltip
          .style("visibility", "visible")
          .html(tooltipContent)
          .style("left", 24 + "px")
          .style("top", 24 + "px");
      })
      .on("mouseout", function () {
        // 호버 벗어날 때 테두리 제거
        d3.select(this).select("rect").attr("stroke", "none");
        // tooltip을 숨김
        tooltip.style("visibility", "hidden");
      })
      .each(function (d: Repository, i) {
        const group = d3.select(this);
        group
          .append("rect")
          .attr("x", () => {
            if (x(new Date(d.createdAt)) > x(new Date(d.pushedAt))) {
              return x(new Date(d.pushedAt));
            }
            return x(new Date(d.createdAt));
          })
          .attr("y", i * 12)
          .attr(
            "width",
            () =>
              Math.abs(x(new Date(d.pushedAt)) - x(new Date(d.createdAt))) + 1,
          )
          .attr("height", 12)
          .attr("fill", colorScale(i.toString()));

        group
          .append("text")
          .attr("x", () => x(new Date(d.createdAt)))
          .attr("y", i * 12 + 10)
          .attr("font-size", "12px")
          .attr("fill", "black")
          .text(() => `${d.name}`)
          .attr("text-anchor", () => {
            // 텍스트의 x 좌표가 SVG 요소의 가운데보다 큰지 여부 확인
            return x(new Date(d.createdAt)) > svgWidth / 4 ? "end" : "start";
          });
      });

    g.append("g").call(xAxis); // 먼저 call 하면 data 짤리는 경우 있음 주의
  }, [repos]);

  return (
    <div className="relative">
      <svg className="w-full" ref={svgRef} />
      <div className="bg-white p-4 rounded-2xl border" ref={tooltipRef}></div>
    </div>
  );
}
