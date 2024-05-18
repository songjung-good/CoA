"use client";

import { useEffect, useState } from "react";
import { Alarm, getAlarmData } from "@/api/alarm/apiAlarm";
import Link from "next/link";

export default function AlarmPage() {
  const [alarmData, setAlarmData] = useState<Alarm[]>([]);

  useEffect(() => {
    getAlarmData().then((data) => {
      setAlarmData(data);
    });
  }, []);
  // alarmData를 createAt의 일자별로 그룹화
  const groupedAlarmData = alarmData?.reduce(
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
    <main className="bg-appGrey1 flex flex-col justify-center items-center">
      <div className="max-w-screen-xl w-full flex flex-col py-4 gap-4">
        <h1 className="text-xl">알림 목록</h1>
        {alarmData.length === 0 ? (
          <div>알림이 없습니다</div>
        ) : (
          <ul>
            {Object.entries(groupedAlarmData).map(([date, alarms]) => (
              <li key={date} className="p-4 m-y-4 border-t-2">
                <p className="text-xl">{date}</p>
                <ul className="flex flex-col gap-2 min-w-16">
                  {alarms.map((alarm, index) => (
                    <li key={index} className="bg-white p-4 border">
                      {alarm.repoViewTitle !== null ? (
                        <>
                          <Link
                            href={`/user/${alarm.memberUuid}`}
                            className="text-appBlue1"
                          >
                            {alarm.memberNickName}
                          </Link>
                          님이
                          <Link
                            href={`/repo/${alarm.repoViewId}`}
                            className="text-appBlue1"
                          >
                            {alarm.repoViewTitle}
                          </Link>
                          를 조회했습니다
                        </>
                      ) : (
                        <>
                          <Link
                            href={`/user/${alarm.memberUuid}`}
                            className="text-appBlue1"
                          >
                            {alarm.memberNickName}
                          </Link>
                          님이 팔로우했습니다
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
