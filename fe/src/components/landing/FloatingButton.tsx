"use client";

import tw from "tailwind-styled-components";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AnalysisIcon from "@/icons/AnalysisIcon.tsx";
import Upicon from "@/icons/Upicon.tsx";

interface FloatingButtonProps {
  showFloatingButton: boolean;
  isButtonsVisible: boolean;
  toggleButtons: () => void;
  scrollToTitle: () => void;
}

export default function FloatingButton({
  showFloatingButton,
  scrollToTitle,
}: FloatingButtonProps) {
  return (
    <>
      {showFloatingButton && (
        <div>
          <ButtonsContainer>
            <button
              className="bg-appOrange text-white mb-2 px-3 py-3 rounded-full"
              onClick={scrollToTitle}
            >
              <Upicon width={30} height={30} />
            </button>
            <Link href="/main">
              <button className="bg-appOrange text-white mb-2 px-3 py-3 rounded-full">
                <AnalysisIcon width={30} height={30} />
              </button>
            </Link>
          </ButtonsContainer>
        </div>
      )}
    </>
  );
}

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  bottom: 4px;
  right: 4px;
  padding: 8px 16px;
  border-radius: 8px;
  z-index: 50;
  transition:
    transform 500ms ease-out,
    bottom 500ms ease-out;
`;
