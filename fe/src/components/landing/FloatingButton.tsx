import styled from "styled-components";
import Link from "next/link";
import AnalysisIcon from "@/icons/AnalysisIcon.tsx";
import Upicon from "@/icons/Upicon.tsx";

interface FloatingButtonProps {
  showFloatingButton: boolean;
  isButtonsVisible: boolean;
  scrollToTitle: () => void;
}

interface ButtonsContainerProps {
  $show: boolean;
}

export default function FloatingButton({
  showFloatingButton,
  scrollToTitle,
}: FloatingButtonProps) {
  return (
    <>
      <div>
        <ButtonsContainer $show={showFloatingButton}>
          <button
            className="bg-appOrange text-white mb-2 px-3 py-3 rounded-full hover:bg-orange-500 transition-colors duration-300"
            onClick={scrollToTitle}
          >
            <Upicon width={30} height={30} />
          </button>
          <Link href="/auth/login">
            <button className="bg-appOrange text-white mb-2 px-3 py-3 rounded-full hover:bg-orange-500 duration-300">
              <AnalysisIcon width={30} height={30} />
            </button>
          </Link>
        </ButtonsContainer>
      </div>
    </>
  );
}

const ButtonsContainer = styled.div<ButtonsContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  bottom: 4px;
  right: 4px;
  padding: 8px 16px;
  border-radius: 8px;
  z-index: 50;
  transform: ${(props) => (props.$show ? "translateY(0)" : "translateY(100%)")};
  transition: transform 200ms ease-out;
`;
