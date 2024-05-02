import repositoryStore from "@/store/repos";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function RunChart() {
  const repos = repositoryStore((state) => state.repos);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || repos.length === 0) return;

    const svg = d3.select(svgRef.current);
    const svgWidth = svgRef.current.getBoundingClientRect().width;
    const width = svgWidth;
    const height = repos.length * 12;
    svg.attr("width", svgWidth).attr("height", height);
  }, []);

  return <svg className="w-full" ref={svgRef} />;
}
