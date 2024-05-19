import useRepoDetailStore from "@/store/repodetail";
import RepoScore from "./RepoScore";

export default function ResultScore() {
  const codeScore = useRepoDetailStore.getState().result.commitScoreDto;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="min-h-60 mb-10">
        <RepoScore />
      </div>
      <div className="bg-white mb-10 shadow-lg rounded-2xl w-full flex justify-center items-center min-h-20 text-lg lg:text-xl px-10 py-4">
        <p className="leading-relaxed">{codeScore.scoreComment}</p>
      </div>
    </div>
  );
}
