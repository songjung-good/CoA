import Link from "next/link";
import UseAxios from "@/api/common/useAxios";
import userStore from "@/store/user";

export default function UserMenu() {
  const axiosInstance = UseAxios();
  const UUID = userStore((state) => state.UUID);
  const logout = async () => {
    try {
      const response = await axiosInstance.post("/api/auth/logout");
      window.location.href = "/";
    } catch (error) {
      console.error("logout 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <div className="absolute top-11 right-0 card min-w-28 z-50">
      <ul className="flex flex-col gap-4">
        <li>
          <Link href={`/user/${UUID}`}>마이 페이지</Link>
        </li>
        <li>
          <Link href={`/auth/link`}>연동 페이지</Link>
        </li>
        <li>
          <button onClick={logout}>로그아웃</button>
        </li>
      </ul>
    </div>
  );
}
