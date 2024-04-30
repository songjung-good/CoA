import { useEffect, useRef } from "react";
import * as d3 from "d3";
import repositoryStore from "@/store/repos";

export default function HistoryChart() {
  const repos = repositoryStore((state) => state.repos);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || repos.length === 0) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleBand().range([height, 0]);

    const g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g").call(d3.axisLeft(y));

    g.selectAll(".bar")
      .data(repos)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(new Date(d.createdAt)))
      .attr("y", 0)
      .attr("width", (d) => {
        const startDate = new Date(d.createdAt);
        const endDate = new Date(d.pushedAt);
        return isNaN(startDate.getTime()) || isNaN(endDate.getTime())
          ? 0
          : x(endDate) - x(startDate);
      })
      .attr("height", y.bandwidth());
  }, [repos]);

  return <svg ref={svgRef} width="960" height="500" />;
}
