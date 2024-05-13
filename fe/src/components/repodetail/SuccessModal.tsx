import React, { useEffect, useState } from "react";
import "./modal.css"; // 애니메이션 스타일을 포함시키세요

interface SuccessModalProps {
  title: string;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ title, message }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState("modal-enter");

  useEffect(() => {
    setIsVisible(true); // 모달을 보여주고

    const timer = setTimeout(() => {
      setAnimationClass("modal-exit"); // 3초 후에 애니메이션 클래스를 변경
      setTimeout(() => setIsVisible(false), 500); // 애니메이션 종료 후 모달 숨김
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg ${animationClass}`}
      style={{ zIndex: 1000 }}
    >
      <p className="text-lg font-semibold">{title}</p>
      <p>{message}</p>
    </div>
  );
};

export default SuccessModal;
