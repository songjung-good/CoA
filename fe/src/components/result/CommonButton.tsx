import React from "react";
import "./Button.css"; // 버튼 스타일을 포함하는 CSS 파일 import

interface CommonButtonProps {
  text: string;
  onClick: () => void;
}

const CommonButton: React.FC<CommonButtonProps> = ({ text, onClick }) => {
  return (
    <button className="button-53" role="button" onClick={onClick}>
      <span className="text">{text}</span>
    </button>
  );
};

export default CommonButton;
