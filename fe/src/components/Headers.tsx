import Image from "next/image";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="p-4 flex flex-row justify-between items-center">
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
      <SearchBar />
      <div>로그인 버튼 / 알림 + 유저 아이콘</div>
    </header>
  );
}
