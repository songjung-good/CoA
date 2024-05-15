"use client";

import { useEffect, useState } from "react";
import { Alarm, getAlarmData } from "@/api/alarm/apiAlarm";

export default function AlarmPage() {
  const [alarmData, setAlarmData] = useState<Alarm[]>([]);

  useEffect(() => {
    getAlarmData().then((data) => {
      setAlarmData(data);
    });
  }, []);
  // alarmData를 createAt의 일자별로 그룹화
  const groupedAlarmData = alarmData.reduce(
    (acc: { [key: string]: Alarm[] }, cur) => {
      const date = cur.createAt.split("T")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(cur);
      return acc;
    },
    {},
  );
  return (
    <main>
      <h1 className="text-xl">알림 목록</h1>
      <ul>
        {Object.entries(groupedAlarmData).map(([date, alarms]) => (
          <li key={date} className="p-1">
            <p className="text-lg">{date}</p>
            <ul className="flex flex-col gap-4 min-w-16">
              {alarms.map((alarm, index) => (
                <li key={index}>
                  {alarm.repoViewTitle !== null ? (
                    <p>
                      {alarm.memberNickName}님이 {alarm.repoViewTitle}를
                      조회했어요!
                    </p>
                  ) : (
                    <p>{alarm.memberNickName}님이 팔로우했어요!</p>
                  )}
                  {/* <p>{alarm.createAt}</p> */}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
