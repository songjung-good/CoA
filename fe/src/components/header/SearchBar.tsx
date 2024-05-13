import SearchIcon from "@/icons/SearchIcon";

export default function SearchBar({ hasJWT }: { hasJWT: boolean }) {
  return (
    hasJWT && (
      <button>
        <SearchIcon />
      </button>
    )
  );
}
