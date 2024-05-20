// 라이브러리
import { useRouter } from "next/navigation";
import UseAxios from '@/api/common/useAxios';
// 데이터
import useRepoDetailStore from '@/store/repodetail';
const router = useRouter();
const axios = UseAxios();
const setRepoDetail = useRepoDetailStore((state) => state.updateResultState);

const getRepoView = async (repoViewId: string) => {
  try {
    const response = await axios.get(`/api/repos/${repoViewId}`);
    setRepoDetail(response.data);
  } catch (error) {
    console.error(error);
  }
};

// 버튼 클릭시 데이터 저장 이후 상세정보 페이지로 이동
export const handleDetailClick = async (repoViewId: string) => {
  await getRepoView(repoViewId);
  router.push(`/repo/${repoViewId}`);
};