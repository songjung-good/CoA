import { CommitScoreDto } from "@/api/userPage/apiAnalysis";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function RadarChart({
  scoreData,
  scoreData2,
}: {
  scoreData: CommitScoreDto;
  scoreData2?: CommitScoreDto;
}) {
  const keyName = {
    exception: "예외 처리",
    readability: "가독성",
    performance: "성능",
    testability: "테스트 용이성",
    reusability: "재활용성",
    total: "총 평균",
  };
  const svgRef = useRef<SVGSVGElement>(null);
  // let data2: { axis: string; value: number }[] | undefined;

  const data2 =
    scoreData2 === undefined
      ? null
      : Object.entries(scoreData2)
          .filter(([key]) => key !== "total") // 'total' 키 필터링
          .map(([key, value]) => ({
            axis: key,
            value: value,
          }));

  // 'total' 키를 제외한 데이터 추출
  const data = Object.entries(scoreData)
    .filter(([key]) => key !== "scoreComment" && key !== "total") // 'total' 키 필터링
    .map(([key, value]) => ({
      axis: key,
      value: value,
    }));
  useEffect(() => {
    if (!svgRef.current) return;
    //중복생성방지
    d3.select(svgRef.current).selectAll("g").remove();
    // 레이더 차트 설정
    const width = 300;
    const height = 220;
    const margin = { top: 30, right: 60, bottom: 20, left: 60 };
    const radius =
      width / 2 -
      Math.max(margin.top, margin.right, margin.bottom, margin.left);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // SVG 생성
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr(
        "transform",
        `translate(${width / 2}, ${(height + margin.top) / 2})`,
      );

    //radarLine 세팅
    const angleSlice = (Math.PI * 2) / data.length;
    const radarLine = d3
      .lineRadial<{ axis: string; value: number }>()
      .radius((d) => (d.value * radius) / 100)
      .angle((d, i) => i * angleSlice);
    // 축 그리기
    svg
      .selectAll(".axis")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "axis")
      .attr(
        "d",
        (d, i) =>
          `M ${radius * Math.cos(angleSlice * i - Math.PI / 2)}, ${radius * Math.sin(angleSlice * i - Math.PI / 2)} L 0,0`,
      )
      .style("stroke", "grey")
      .style("stroke-width", "1px");

    // 항목 이름 표시
    svg
      .selectAll(".axisLabel")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "axisLabel")
      .attr(
        "x",
        (d, i) => (radius + 12) * Math.cos(angleSlice * i - Math.PI / 2),
      )
      .attr(
        "y",
        (d, i) => (radius + 12) * Math.sin(angleSlice * i - Math.PI / 2),
      )
      .attr("text-anchor", "middle")
      .text((d) => keyName[d.axis as keyof typeof keyName]);

    // 반경 선 추가
    const levels = [20, 40, 60, 80, 100];
    levels.forEach((level) => {
      svg
        .append("path")
        .datum(d3.range(data.length + 1))
        .attr("class", "level")
        .attr(
          "d",
          d3
            .lineRadial<number>()
            .radius((d, i) => (level * radius) / 100)
            .angle((d, i) => i * angleSlice)
            .curve(d3.curveLinearClosed),
        )
        .style("fill", "none")
        .style("stroke", "grey")
        .style("stroke-width", "1px");
    });
    // 레이더 차트 그리기
    svg
      .selectAll(".radar")
      .data([data])
      .enter()
      .append("path")
      .attr("class", "radar")
      .attr("d", (d) => radarLine([...d, d[0]]))
      .style("fill", "#88DDFB80")
      .style("stroke", "#88DDFB") // 경계선 색상 지정
      .style("stroke-width", "2px");
    // .style("fill-opacity", 0.5);
    if (data2 !== null) {
      svg
        .selectAll(".radar2")
        .data([data2])
        .enter()
        .append("path")
        .attr("class", "radar")
        .attr("d", (d) => radarLine([...d, d[0]]))
        .style("fill", "#FBA68880")
        .style("stroke", "#FBA688") // 경계선 색상 지정
        .style("stroke-width", "2px");
      // .style("fill-opacity", 0.2);
    }
  }, [data, data2]);

  return <svg ref={svgRef}></svg>;
}
