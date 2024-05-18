import Image from "next/image";
import SearchBar from "./SearchBar";
import LoadingAnalyzing from "./LoadingAnalyzing";
import Link from "next/link";
import AuthButton from "./AuthButton";
import Gauge from "./Gauge";
import RequestApi from "./RequestApi";
import { cookies } from "next/headers";

export default function Header() {
  const cookieStore = cookies();
  // cookie 존재 여부를 boolean으로 return
  const hasJWT = cookieStore.has("JWT");

  return (
    <header className="p-4 border-b-2 flex flex-row mx-auto w-full justify-between items-center max-w-screen-xl bg-header-bg bg-cover">
      <Link href="/main">
        <div className="flex flex-row items-center">
          <Image
            src="/image/logo48.webp"
            alt="logo"
            width={48}
            height={48}
            className="mr-4"
          />
          <div className="hidden md:block">
            <Image
              src="/image/textLogo48.webp"
              alt="logoText"
              width={128}
              height={40}
              style={{ width: 128, height: 40 }}
            />
          </div>
        </div>
      </Link>
      <div className="w-1/2">
        <Gauge hasJWT={hasJWT} />
      </div>
      <div className="flex gap-2">
        {/* <Notification hasJWT={hasJWT} /> */}
        <LoadingAnalyzing hasJWT={hasJWT} />
        <SearchBar hasJWT={hasJWT} />
        <AuthButton hasJWT={hasJWT} />
        <RequestApi />
      </div>
    </header>
  );
}
