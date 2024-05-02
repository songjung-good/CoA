import { useRef } from "react";

export default function RunChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  return <svg className="w-full" ref={svgRef} />;
}
