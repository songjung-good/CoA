import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="flex justify-center items-center">
      <div className="flex flex-col gap-4 justify-center items-center shadow-lg p-8">
        <Image src="/image/logo144.png" alt="logo" width={144} height={144} />
        <h1>시작하기</h1>
        <button>github</button>
        <button>google</button>
      </div>
    </main>
  );
}
