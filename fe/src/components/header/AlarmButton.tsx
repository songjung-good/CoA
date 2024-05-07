import BellIcon from "@/icons/BellIcon";
import { useState } from "react";

export default function AlarmButton() {
  const [alarmModal, setAlarmModal] = useState(false);

  return (
    <div className="relative flex justify-center items-center">
      {alarmModal ? (
        <div className="absolute top-10 right-0 card">
          <p className="w-16">알림 목록</p>
          <ul>
            <li>알림 1</li>
            <li>알림 2</li>
          </ul>
        </div>
      ) : null}
      <button
        onClick={() => {
          setAlarmModal(!alarmModal);
        }}
      >
        <BellIcon />
      </button>
    </div>
  );
}
