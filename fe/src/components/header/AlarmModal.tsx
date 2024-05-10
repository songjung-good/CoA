"use client";

import { useEffect, useState } from "react";
import { Alarm, getAlarmData } from "@/api/alarm/apiAlarm";

export default function AlarmModal() {
  const [alarmData, setAlarmData] = useState<Alarm[]>([]);

  useEffect(() => {
    getAlarmData().then((data) => {
      setAlarmData(data);
    });
  }, []);

  return (
    <>
      <p>알림 목록</p>
      <ul className="flex flex-col gap-4 min-w-16">
        {alarmData.map((alarm, index) => (
          <li key={index}>
            {alarm.repoViewTitle !== null ? (
              <p>
                {alarm.memberNickName}님이 {alarm.repoViewTitle}를 조회했어요!
              </p>
            ) : (
              <p>{alarm.memberNickName}님이 팔로우했어요!</p>
            )}
            <p>{alarm.createAt}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
