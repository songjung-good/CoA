"use client";

import userStore from "@/store/user";
import Image from "next/image";
import Link from "next/link";

export default function AuthButton({ hasJWT }: { hasJWT: boolean }) {
  const authUserName = userStore((state) => state.AuthUserName);
  const userImage = userStore((state) => state.userImage);
  return (
    <div className="flex gap-2">
      {hasJWT ? (
        <>
          <Link href={`/user/${authUserName}`}>
            <div
              style={{
                border: "solid",
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <Image src={userImage} alt="logo" width={48} height={48} />
            </div>
          </Link>
          <button>로그아웃</button>
        </>
      ) : (
        <Link href="/auth/login">로그인</Link>
      )}
    </div>
  );
}
