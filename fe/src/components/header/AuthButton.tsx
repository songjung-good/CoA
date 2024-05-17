import Link from "next/link";
import AlarmButton from "./AlarmButton";
import UserIconButton from "./UserIconButton";

export default function AuthButton({ hasJWT }: { hasJWT: boolean }) {
  return (
    <div className="flex gap-2 items-center">
      {hasJWT ? (
        <>
          <AlarmButton />
          <UserIconButton />
        </>
      ) : (
        <Link href="/auth/login" className="text-sm text-nowrap sm:text:xl">
          로그인
        </Link>
      )}
    </div>
  );
}
