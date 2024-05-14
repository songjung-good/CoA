"use client";

import SearchIcon from "@/icons/SearchIcon";
import { useRouter } from "next/navigation";

export default function SearchBar({ hasJWT }: { hasJWT: boolean }) {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/search');
  };

  return (
    hasJWT && (
      <button onClick={handleButtonClick}>
        <SearchIcon />
      </button>
    )
  );
}