// 라이브러리
import React from 'react';
import UseAxios from '@/api/common/useAxios';
// 컴포넌트
import MainRepoCard from '@/components/maincomponents/MainRepoCard';
import useRepoDetailStore from '@/store/repodetail';
import { useRouter } from "next/navigation";
// 임시데이터
import repocardDTO from '@/components/maincomponents/repocardDTO';

const axios = UseAxios();

const ExhibitRepo: React.FC = () => {
  const router = useRouter();
  // 임시데이터 값
  const data = repocardDTO.temporaryData;

  const setRepoDetail = useRepoDetailStore((state: any) => state.setRepoDetail);

  const getRepoView = async (repoViewId: string) => {
    try {
      const response = await axios.get(`/api/repos/${repoViewId}`);
      console.log(response.data);
      setRepoDetail(response.data); // store에 데이터 저장
    } catch (error) {
      console.error(error);
    }
  };

  const handleDetailClick = (repoViewId: string) => {
    getRepoView(repoViewId);
    router.push(`/result/${repoViewId}/repo`);
  };

  return (
    <div className='flex flex-wrap justify-center align-center mt-5'>
      {data.map((item, index) => (
        <MainRepoCard key={index} data={item} onDetailClick={handleDetailClick} /> // 데이터와 콜백 함수 전달
      ))}
    </div>
  );
};

export default ExhibitRepo;