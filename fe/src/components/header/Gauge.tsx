"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";

import useAnalyzingStore from "@/store/analyze";

type StyledRangeProps = React.HTMLProps<HTMLDivElement> & {
  width: number;
};

const StyledBase = styled.div`
  height: 26px; // 게이지 부분의 높이에 border 높이의 2배를 더해준다.
  // border: 2px solid blue;
  margin-right: 15%; // 페이지에서 원하는 부분만큼 자유롭게 설정
  margin-left: 15%;
  justify-content: center;
  border-radius: 25px;
  background-color: #f6f6f6;
  transition: width 0.5s ease-in-out;
`;

const StyledRange = styled.div<StyledRangeProps>`
  width: ${({ width }) => `${width}%`};
  height: 26px;
  border-radius: 25px;
  background: linear-gradient(to right, #c8effd, #48caf8);
`;

function Gauge({ initialExp = 0 }) {
  const [width, setWidth] = useState(initialExp % 100);
  const analyzingPercent = useAnalyzingStore((state) => state.analyzingPercent);
  const isAnalyzing = useAnalyzingStore((state) => state.isAnalyzing);

  useEffect(() => {
    setWidth(analyzingPercent);
  }, [analyzingPercent]);

  return (
    <div>
      {isAnalyzing && (
        <StyledBase>
          <StyledRange width={width} />
        </StyledBase>
      )}
    </div>
  );
}

export default Gauge;
