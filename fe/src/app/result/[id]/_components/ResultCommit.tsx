import useResultStore from "@/store/result";

export default function ResultCommit() {
  const repo = useResultStore.getState().result.repoCardDto;
  const result = useResultStore.getState().result.basicDetailDto;

  return (
    <div className="flex flex-col w-full justify-between">
      <div className="flex flex-col justify-center items-center min-h-80">
        커밋 그래프
      </div>
      <p className="text-base sm:text-xl lg:text-2xl mt-2">
        <span className=" text-appBlue1">{repo.memberNickname}</span> 님의{" "}
        <span className=" text-appBlue1">{repo.repoViewTitle}</span> 프로젝트
        분석결과
      </p>
      <div className="flex justify-center items-center w-full min-h-20 bg-white shadow-lg rounded-lg mt-2 text-xl lg:text-xl">
        <div>{result.repoViewResult}</div>
      </div>
    </div>
  );
}
