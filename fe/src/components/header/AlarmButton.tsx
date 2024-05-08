"use client";

import BellIcon from "@/icons/BellIcon";
import { useEffect, useRef, useState } from "react";

export default function AlarmButton() {
  const [alarmModal, setAlarmModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setAlarmModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex justify-center items-center">
      <button
        onClick={() => {
          setAlarmModal(!alarmModal);
        }}
      >
        <BellIcon />
      </button>
      {alarmModal ? (
        <div className="absolute top-10 right-0 card z-50" ref={modalRef}>
          <ul className="flex flex-col gap-4 min-w-16">
            <li>알림 목록</li>
            <li>알림 1</li>
            <li>알림 2</li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
