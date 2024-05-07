import useResultStore from "@/store/result";
import RepoScore from "./RepoScore";

export default function ResultScore() {
  const codeScore = useResultStore.getState().result.commitScoreDto;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="min-h-60 mb-10">
        <RepoScore />
      </div>
      <div className="bg-white mb-10 shadow-lg rounded-2xl w-full flex justify-center min-h-32">
        레포점수
      </div>
      <div className="bg-white shadow-lg rounded-2xl w-full flex justify-center min-h-32">
        레포점수
      </div>
    </div>
  );
}
