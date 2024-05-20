"use client";

import useAnalyzingStore from "@/store/analyze";
import { useEffect } from "react";
import useInterval from "../hooks/UseInterval";

export default function RequestApi() {
  const { isAnalyzing, analyzingPercent, feachApi } = useAnalyzingStore();

  useEffect(() => {
    if (isAnalyzing && analyzingPercent < 100) {
      const interval = setInterval(feachApi, 3000);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing, analyzingPercent, feachApi]);

  return null;
}
