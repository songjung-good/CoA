import UseAxios from "@/api/common/useAxios";
import userStore from "@/store/user";
import { useRouter } from "next/navigation";

export default function UserMenu({ modalClose }: { modalClose: () => void }) {
  const axiosInstance = UseAxios();
  const UUID = userStore((state) => state.UUID);
  const router = useRouter();
  const logout = async () => {
    try {
      const response = await axiosInstance.post("/api/auth/logout");
      window.location.href = "/";
    } catch (error) {
      console.error("logout 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <div className="absolute top-11 right-0 card min-w-32 z-50">
      <ul className="flex flex-col gap-4">
        <li
          className="cursor-pointer"
          onClick={() => {
            modalClose();
            router.push(`/user/${UUID}`);
          }}
        >
          마이 페이지
        </li>
        <li
          className="cursor-pointer"
          onClick={() => {
            modalClose();
            router.push(`/user/follow`);
          }}
        >
          팔로우 페이지
        </li>
        <li
          className="cursor-pointer"
          onClick={() => {
            modalClose();
            router.push(`/auth/link`);
          }}
        >
          연동 페이지
        </li>
        <li>
          <button onClick={logout}>로그아웃</button>
        </li>
      </ul>
    </div>
  );
}
