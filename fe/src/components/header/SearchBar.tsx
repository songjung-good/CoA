"use client";

import SearchIcon from "@/icons/SearchIcon";
import { useRouter } from "next/navigation";

export default function SearchBar({ hasJWT }: { hasJWT: boolean }) {
  const router = useRouter();
  return (
    hasJWT && (
      <button onClick={() => router.push(`/search`)}>
        <SearchIcon />
      </button>
    )
  );
}
