"use client";

import { useRef, useEffect } from "react";

// useInterval 훅을 정의합니다. callback은 함수이고 delay는 number 또는 null이 될 수 있습니다.
export default function useInterval(
  callback: () => void,
  delay: number | null,
): void {
  const savedCallback = useRef<() => void>(); // 가장 최근에 입력된 callback을 저장할 ref를 생성합니다.

  useEffect(() => {
    savedCallback.current = callback; // callback이 변경될 때마다 ref를 업데이트합니다.
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current?.(); // tick이 실행되면 저장된 callback 함수를 실행합니다.
    }
    if (delay !== null) {
      // delay가 null이 아니라면
      let id = setInterval(tick, delay); // 설정된 delay에 따라 interval을 시작합니다.
      return () => clearInterval(id); // 컴포넌트가 언마운트될 때 interval을 정리합니다.
    }
  }, [delay]); // delay가 변경될 때마다 이 effect를 재실행합니다.
}
