import RepoInfo from "@/components/result/RepoInfo.tsx";
import ResultTap from "@/components/result/ResultTap.tsx";

export default function ResultPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col items-center bg-appGrey1 pt-5 p-10 w-full h-full">
      <p className="mb-5 text-2xl font-bold">
        OOO님의 레포지토리 분석 결과입니다.
      </p>
      <RepoInfo />
      <ResultTap />
    </div>
  );
}
