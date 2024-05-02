import RepoInfo from "@/components/result/RepoInfo.tsx";
import ResultTap from "@/components/result/ResultTap.tsx";

export default function ResultPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col justify-center items-center bg-appGrey1 py-5">
      <RepoInfo />
      <ResultTap />
    </div>
  );
}
