"use client";

import BellIcon from "@/icons/BellIcon";
import { useEffect, useRef, useState } from "react";
import { Alarm, getAlarmCountData } from "@/api/alarm/apiAlarm";
import AlarmModal from "./AlarmModal";

export default function AlarmButton() {
  const [alarmModal, setAlarmModal] = useState(false);
  const [alarmCount, setAlarmCount] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAlarmCountData().then((count) => {
      setAlarmCount(count);
    });
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        getAlarmCountData().then((count) => {
          setAlarmCount(count);
        });
        setAlarmModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAlarmButton = () => {
    setAlarmModal(!alarmModal);
  };

  return (
    <div className="relative flex justify-center items-center">
      <button onClick={handleAlarmButton}>
        <BellIcon />
        {alarmCount !== 0 ? (
          <div className="absolute top-0 right-0 bg-red-500 rounded-full w-4 h-4"></div>
        ) : null}
      </button>
      {alarmModal ? (
        <div className="absolute top-10 right-0 card z-50" ref={modalRef}>
          <AlarmModal />
        </div>
      ) : null}
    </div>
  );
}
