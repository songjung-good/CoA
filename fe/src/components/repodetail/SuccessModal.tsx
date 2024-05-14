import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import "./modal.css"; // 애니메이션 스타일을 포함시키세요

interface SuccessModalProps {
  title: string;
  message: string;
  setShowModal: Dispatch<SetStateAction<boolean>>; // 타입 수정
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  title,
  message,
  setShowModal,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState("modal-enter");

  useEffect(() => {
    setIsVisible(true); // 모달을 보여주고

    const timer = setTimeout(() => {
      setAnimationClass("modal-exit"); // 3초 후에 애니메이션 클래스를 변경
      setTimeout(() => {
        setIsVisible(false); // 애니메이션 종료 후 모달 숨김
        setShowModal(false); // setShowModal을 false로 설정하여 모달을 다시 열 수 있게 함
      }, 500);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [setShowModal]); // setShowModal을 의존성 배열에 추가

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
