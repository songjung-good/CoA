import UseAxios from "@/api/common/useAxios";
import { useRouter } from "next/navigation";
export default function WaveButton() {
  const buttonCSS =
    "px-6 py-3 rounded-lg bg-appGrey1 hover:bg-appBlue1 whitespace-nowrap";
  const router = useRouter();

  const getRandomUUID = async () => {
    try {
      // console.log(UUID);
      const getResponse = await UseAxios().get(`/api/member/random`);
      // console.log(getResponse.data.result);
      const UUID = getResponse.data.result;
      router.push(`/user/${UUID}`);
    } catch (error) {
      console.error(`/api/member/random 요청 에러`, error);
    }
  };
  return (
    <button
      onClick={() => {
        getRandomUUID();
      }}
      className={`${buttonCSS} bg-gradient-to-r from-[#F5E5CA] to-[#41EAE5]`}
    >
      파도타기
    </button>
  );
}
