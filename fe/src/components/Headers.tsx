import Image from "next/image";
import SearchBar from "./SearchBar";
import LoadingAnalyzing from "./LoadingAnalyzing";
import Link from "next/link";

export default function Header() {
  return (
    <header className="p-4 flex flex-row justify-between items-center">
      <Link href="/">
        <div className="flex flex-row items-center">
          <Image
            src="/image/logo48.png"
            alt="logo"
            width={48}
            height={48}
            className="mr-4"
          />
          <div>
            <Image
              src="/image/textLogo48.png"
              alt="logoText"
              width={128}
              height={40}
              style={{ width: 128, height: 40 }}
            />
          </div>
        </div>
      </Link>
      <SearchBar />
      <LoadingAnalyzing />
      <Link href="/auth/login">로그인</Link>
    </header>
  );
}
