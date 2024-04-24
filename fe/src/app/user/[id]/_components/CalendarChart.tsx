import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  Contribution,
  getContributions,
} from "@/api/userPage/apiContributions";

const CalendarChart: React.FC = () => {
  // github에서 contributions(잔디) 가져오기
  const [data, setData] = useState<Contribution[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getContributions();
      setData(res.contributions);
    };
    fetchData();
  }, []);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    const cellSize = 16;
    const width = cellSize * 52;
    const height = cellSize * 7;
    const colorRange: string[] = [
      "#ebedf0",
      "#9be9a8",
      "#40c463",
      "#30a14e",
      "#216e39",
    ];
    const numericColorRange: number[] = colorRange.map((color) =>
      parseInt(color.slice(1), 16),
    );
    const color = d3.scaleQuantize().domain([0, 4]).range(colorRange);

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

  return <svg ref={svgRef}></svg>;
};

export default CalendarChart;
