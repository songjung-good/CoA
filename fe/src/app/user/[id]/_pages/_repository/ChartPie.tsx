import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { LanguageStats } from "@/api/userPage/apiLinesOfCode";
import { colorMapping } from "../../_components/colorMap";

interface DataType {
  language: string;
  lines: number;
}

const MyPageRepositoryCardChart = ({
  languages,
  totalLinesOfCode,
}: {
  languages: LanguageStats;
  totalLinesOfCode: number;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  if (Object.keys(languages).length === 0) {
    return null;
  }
  useEffect(() => {
    const data = Object.entries(languages).map(([language, lines]) => ({
      language,
      lines,
    }));
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const svgWidth = svgRef.current.getBoundingClientRect().width;

    // Specify the chart’s dimensions.
    const width = svgWidth;
    const height = Math.min(width, 500);

    // Create the color scale.
    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.language))
      .range(
        d3
          .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
          .reverse(),
      );

    // Create the pie layout and arc generator.
    const pie = d3
      .pie<DataType>()
      // .sort(null)
      .value((d) => d.lines);

    const radius = Math.min(width, height) / 2 - 1;
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const labelRadius = radius * 0.8;

    // A separate arc generator for labels.
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    const arcs = pie(data);

    // Create the SVG container.
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    // Add a sector path for each value.
    svg
      .append("g")
      .attr("stroke", "white")
      .selectAll()
      .data(arcs)
      .join("path")
      .attr("fill", (d) => colorMapping[d.data.language])
      .attr("d", (d) => {
        const defaultArcObject: d3.DefaultArcObject = {
          innerRadius: 0,
          outerRadius: radius,
          startAngle: d.startAngle,
          endAngle: d.endAngle,
          padAngle: d.padAngle,
        };
        return arc(defaultArcObject) || "";
      })
      .append("title")
      .text(
        (d) => `${d.data.language}: ${d.data.lines.toLocaleString("en-US")}`,
      );

    // Create a new arc generator to place a label close to the edge.
    // The label shows the value if there is enough room.
    svg
      .append("g")
      .attr("text-anchor", "middle")
      .selectAll()
      .data(arcs)
      .join("text")
      .attr("transform", (d) => {
        const defaultArcObject: d3.DefaultArcObject = {
          innerRadius: 0,
          outerRadius: radius,
          startAngle: d.startAngle,
          endAngle: d.endAngle,
          padAngle: d.padAngle,
        };
        return `translate(${arcLabel.centroid(defaultArcObject)})`;
      })
      .call((text) =>
        text
          .append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text((d) => d.data.language),
      )
      .call((text) =>
        text
          .filter((d) => d.endAngle - d.startAngle > 0.25)
          .append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
          .text((d) => d.data.lines.toLocaleString("en-US")),
      );
  }, []);

  return (
    <div className="flex p-4 gap-4">
      <svg ref={svgRef}></svg>
      <ul>
        <h3 className="font-semibold">
          Total Lines of Code: {totalLinesOfCode}
        </h3>
        {Object.entries(languages).map(([language, lines], index) => (
          <li key={index}>
            {language}: {lines} ({((lines / totalLinesOfCode) * 100).toFixed(2)}
            %)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyPageRepositoryCardChart;
