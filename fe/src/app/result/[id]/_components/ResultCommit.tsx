export default function ResultCommit() {
  return (
    <div className="flex flex-col w-full justify-between">
      <p className="text-base sm:text-xl lg:text-2xl">
        <span className=" text-appBlue1">{"{프로젝트명}"}</span>
        에서
        <span className=" text-appBlue1">{"{유저명}"}</span>
        님의 구현 내용은 다음과 같아요!
      </p>
      <div className="flex justify-center w-full h-2/5 bg-white shadow-lg rounded-2xl">
        <div className="">구현 내용 목록</div>
      </div>
      <p className="text-base sm:text-xl lg:text-2xl">
        <span className=" text-appBlue1">{"{프로젝트명}"}</span>
        에서
        <span className=" text-appBlue1">{"{유저명}"}</span>
        님의 사용 기술은 다음과 같아요!
      </p>
      <div className="flex justify-center w-full h-2/5 bg-white shadow-lg rounded-2xl">
        <div className="">사용 기술 내역</div>
      </div>
    </div>
  );
}
