import SearchIcon from "@/icons/SearchIcon";

export default function SearchBar({ hasJWT }: { hasJWT: boolean }) {
  return (
    hasJWT && (
      <div className="flex flex-row items-center">
        <input className="bg-appGrey1 h-8 p-4 rounded-2xl"></input>
        <button>
          <SearchIcon />
        </button>
      </div>
    )
  );
}
