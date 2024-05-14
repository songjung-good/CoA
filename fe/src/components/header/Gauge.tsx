"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";

import useAnalyzingStore from "@/store/analyze";

// StyledRangeProps 타입 정의
type StyledRangeProps = React.HTMLProps<HTMLDivElement> & {
  width: number;
};

// StyledBase 컴포넌트 정의
const StyledBase = styled.div`
  height: 30px; // 게이지 부분의 높이에 border 높이의 2배를 더해준다.
  justify-content: center;
  border-radius: 25px;
  margin-right: 10%;
  margin-left: 10%;
  background-color: #f6f6f6;
  transition: width 0.5s ease-in-out;
  display: flex;
  align-items: center;
`;

// StyledRange 컴포넌트 정의
const StyledRange = styled.div<StyledRangeProps>`
  width: ${({ width }) => `${width}%`};
  height: 30px;
  border-radius: 25px;
  background: linear-gradient(to right, #c8effd, #48caf8);
`;

// StyledPercentage 컴포넌트 정의
const StyledPercentage = styled.span`
  font-size: 14px;
  color: #333;
  font-weight: bold;

  @media (max-width: 600px) {
    font-size: 12px;
  }

  @media (min-width: 601px) and (max-width: 1200px) {
    font-size: 14px;
  }

  @media (min-width: 1201px) {
    font-size: 16px;
  }
`;

function Gauge({ initialExp = 0 }) {
  const [width, setWidth] = useState(initialExp % 100);
  const analyzingPercent = useAnalyzingStore((state) => state.analyzingPercent);
  const isAnalyzing = useAnalyzingStore((state) => state.isAnalyzing);
  const isCompleted = useAnalyzingStore((state) => state.isCompleted);

  useEffect(() => {
    setWidth(analyzingPercent);
  }, [analyzingPercent]);

  return (
    <div>
      {isAnalyzing && (
        <StyledBase>
          <StyledRange width={width} />
          <StyledPercentage>
            {isCompleted ? "분석이 완료되었습니다." : `${width}%`}
          </StyledPercentage>
        </StyledBase>
      )}
    </div>
  );
}

export default Gauge;
