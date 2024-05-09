"use client";

import BellIcon from "@/icons/BellIcon";
import { useEffect, useRef, useState } from "react";
import UseAxios from "@/api/common/useAxios";
import { Alarm, getAlarmCountData, getAlarmData } from "@/api/alarm/apiAlarm";

export default function AlarmButton() {
  const [alarmModal, setAlarmModal] = useState(false);
  const [alarmCount, setAlarmCount] = useState(0);
  const [alarmData, setAlarmData] = useState<Alarm[]>([]);
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
    // if (alarmModal === false) {
    getAlarmData().then((data) => {
      setAlarmData(data);
    });
    setAlarmModal(true);
    // }
    // else {
    //   getAlarmCountData().then((count) => {
    //     setAlarmCount(count);
    //   });
    //   setAlarmModal(false);
    // }
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
          <p>알림 목록</p>
          <ul className="flex flex-col gap-4 min-w-16">
            {alarmData.map((alarm, index) => (
              <li key={index}>
                {alarm.repoViewTitle !== null ? (
                  <p>
                    {alarm.memberNickName}님이 {alarm.repoViewTitle}를
                    조회했어요!
                  </p>
                ) : (
                  <p>{alarm.memberNickName}님이 팔로우했어요!</p>
                )}
                <p>{alarm.createAt}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
