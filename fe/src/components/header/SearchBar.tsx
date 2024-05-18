"use client";

import SearchIcon from "@/icons/SearchIcon";
import { useRouter } from "next/navigation";

export default function SearchBar({ hasJWT }: { hasJWT: boolean }) {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/search");
  };

  return (
    hasJWT && (
      <button id="searchpage" aria-label="검색하기" onClick={handleButtonClick}>
        <div className="w-5 h-5 md:w-7 md:h-7 lg:w-10 lg:h-10">
          <SearchIcon />
        </div>
      </button>
    )
  );
}
