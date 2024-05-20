import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { LanguageStats } from "@/api/userPage/apiLinesOfCode";
import { colorMapping } from "../../../../../components/colorMap";

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
    return <h3 className="font-semibold">No Code in this Repository</h3>;
  }
  useEffect(() => {
    const data = Object.entries(languages).map(([language, lines]) => ({
      language,
      lines,
    }));
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Specify the chart’s dimensions.
    const width = 168;
    const height = 168;

    // Create the pie layout and arc generator.
    const pie = d3
      .pie<DataType>()
      // .sort(null)
      .value((d) => d.lines);

    const radius = Math.min(width, height) / 2 - 1;
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const labelRadius = radius * 0.7;

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
      .attr("fill", (d) => colorMapping[d.data.language] || "steelblue")
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
      {/* <ul>
        <h3 className="font-semibold">
          Total Lines of Code: {totalLinesOfCode}
        </h3>
        {Object.entries(languages).map(([language, lines], index) => (
          <li key={index}>
            {language}: {lines} ({((lines / totalLinesOfCode) * 100).toFixed(2)}
            %)
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default MyPageRepositoryCardChart;
