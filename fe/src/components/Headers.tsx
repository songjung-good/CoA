import Image from "next/image";

export default function Header() {
  return (
    <header className="flex flex-row p-5">
      <div className="flex flex-row">
        <Image
          src="/image/logo48.png"
          alt="logo"
          width={30}
          height={30}
          className="mr-3"
        />
        <Image
          src="/image/logoText.png"
          alt="logoText"
          width={99}
          height={30}
        />
      </div>
    </header>
  );
}
