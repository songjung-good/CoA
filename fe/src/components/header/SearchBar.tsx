'use client'
import { useRouter } from 'next/navigation';
import SearchIcon from "@/icons/SearchIcon";

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