"use client";

import { useEffect, useState, useRef } from "react";
import useAnalyzingStore from "@/store/analyze";
import "./noti.css";

export default function Notification({ hasJWT }: { hasJWT: boolean }) {
  const { showNotification } = useAnalyzingStore((state) => state);
  const notificationRef = useRef<HTMLDivElement | null>(null); // DOM 참조를 저장하기 위한 ref
  const [notificationClass, setNotificationClass] = useState(
    "notification-fade-in",
  );

  useEffect(() => {
    if (showNotification) {
      // 3초 후에 fadeOut 애니메이션 시작
      const fadeOutTimer = setTimeout(() => {
        if (notificationRef.current) {
          notificationRef.current.classList.add("notification-fade-out");
        }
      }, 5000); // 3초 기다린 후 fadeOut 클래스 추가

      const handleAnimationEnd = (event: AnimationEvent) => {
        if (event.animationName === "fadeOut") {
          useAnalyzingStore.getState().toggleNotification(false); // 알림 상태를 숨김으로 변경
        }
      };

      const currentElement = notificationRef.current;
      if (currentElement) {
        currentElement.addEventListener("animationend", handleAnimationEnd);
      }

      return () => {
        clearTimeout(fadeOutTimer); // 타이머 클린업
        if (currentElement) {
          currentElement.removeEventListener(
            "animationend",
            handleAnimationEnd,
          );
        }
      };
    }
  }, [showNotification]);

  if (!showNotification) return null;

  return (
    hasJWT && (
      <div
        ref={notificationRef}
        className={`notification ${notificationClass}`}
      >
        <p>분석이 완료되었습니다!</p>
      </div>
    )
  );
}
