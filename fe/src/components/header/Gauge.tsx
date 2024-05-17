"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";

import useAnalyzingStore from "@/store/analyze";
import UrlInput from "@/app/main/analyzer/UrlInput";

// StyledRangeProps 타입 정의
type StyledRangeProps = React.HTMLProps<HTMLDivElement> & {
  width: number;
};

// StyledBase 컴포넌트 정의
const StyledBase = styled.div`
  height: 30px; // 게이지 부분의 높이에 border 높이의 2배를 더해준다.
  border-radius: 25px;
  margin-right: 10%;
  margin-left: 10%;
  background-color: #f6f6f6;
  transition: width 0.5s ease-in-out;
  display: flex;
  align-items: center;
  position: relative; // 자식 요소의 절대 위치를 위한 relative 설정
`;

// StyledRange 컴포넌트 정의
const StyledRange = styled.div<StyledRangeProps>`
  width: ${({ width }) => `${width}%`};
  height: 100%; // 부모 요소의 높이를 그대로 사용
  border-radius: 25px;
  background: linear-gradient(to right, #c8effd, #48caf8);
  position: absolute; // 위치를 절대 위치로 설정
  top: 0; // 부모 요소의 맨 위에 위치
  left: 0; // 부모 요소의 왼쪽에 위치
`;

// StyledPercentage 컴포넌트 정의
const StyledPercentage = styled.span`
  position: absolute;
  width: 100%; // 부모 요소의 너비를 가득 채움
  text-align: center; // 텍스트를 가운데 정렬
  font-size: 14px;
  color: #333;
  font-weight: bold;
  z-index: 1; // 게이지 뒤에 표시되도록 z-index 설정

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

// GaugeProps 타입 정의
type GaugeProps = {
  initialExp?: number;
  hasJWT: boolean;
};

function Gauge({ initialExp = 0, hasJWT }: GaugeProps) {
  const [width, setWidth] = useState(initialExp % 100);
  const analyzingPercent = useAnalyzingStore((state) => state.analyzingPercent);
  const isAnalyzing = useAnalyzingStore((state) => state.isAnalyzing);
  const isCompleted = useAnalyzingStore((state) => state.isCompleted);

  useEffect(() => {
    setWidth(analyzingPercent);
  }, [analyzingPercent]);

  return (
    <div>
      {hasJWT && (
        <div className="hidden md:block">
          {isAnalyzing ? (
            <StyledBase>
              <StyledRange width={width} />
              <StyledPercentage>
                {analyzingPercent === undefined
                  ? "분석에 실패했습니다. 다시 요청해주세요."
                  : isCompleted
                    ? "분석이 완료되었습니다."
                    : `${width}%`}
              </StyledPercentage>
            </StyledBase>
          ) : (
            <UrlInput />
          )}
        </div>
      )}
    </div>
  );
}

export default Gauge;
