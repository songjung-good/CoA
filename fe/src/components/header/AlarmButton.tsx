"use client";

import BellIcon from "@/icons/BellIcon";
import { useEffect, useRef, useState } from "react";
import { getAlarmCountData } from "@/api/alarm/apiAlarm";
import AlarmModal from "./AlarmModal";
import { useRouter } from "next/navigation";

export default function AlarmButton() {
  const [alarmModal, setAlarmModal] = useState(false);
  const [alarmCount, setAlarmCount] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    getAlarmCountData().then((count) => {
      setAlarmCount(count);
    });
    //AlarmButton 밖을 누르면 동작하는 함수
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        //미열람 알람수를 받아옴
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
    // setAlarmModal(!alarmModal);
    router.push("/alarm");
  };

  return (
    <div className="relative flex justify-center items-center" ref={modalRef}>
      <button id="goAlarm" aria-label="알람 확인" onClick={handleAlarmButton}>
        <div className="w-5 h-5 md:w-7 md:h-7 lg:w-10 lg:h-10">
          <BellIcon />
        </div>
        {alarmCount !== 0 ? (
          <div className="absolute top-0 right-0 bg-red-500 rounded-full w-4 h-4"></div>
        ) : null}
      </button>
    </div>
  );
}
