import {
  CommitScoreDto,
  Jobs,
  RepoAnalysisResponse,
  getUserAnalysisData,
  getUserAnalysisDummyData,
} from "@/api/userPage/apiAnalysis";
import userStore from "@/store/user";
import { useEffect, useState } from "react";
import RadarChart from "./RadarChart";
import AnalysisCard from "./AnalysisCard";

export default function UserAnalysisPage({ uuid }: { uuid: string }) {
  const { UUID } = userStore();
  // const fetchData = getUserAnalysisDummyData(UUID);
  const [data, setData] = useState<RepoAnalysisResponse>();
  const fetchData = async () => {
    const res = await getUserAnalysisData(uuid);
    setData(res);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const keyName = {
    exception: "예외 처리",
    readability: "가독성",
    performance: "성능",
    testability: "테스트 용이성",
    reusability: "재활용성",
    total: "총 평균",
  };
  const [selectedJob, setSelectedJob] = useState("FE");
  return (
    <>
      {data !== undefined ? (
        <>
          <AnalysisCard data={data} />
          {/* repos */}
          <section className="flex flex-col gap-4">
            {data.repos.map((repo) => (
              <div
                className="card flex gap-4 justify-center"
                key={repo.repoViewId}
              >
                <div>
                  <h3 className="text-xl">{repo.repoTitle}</h3>
                  <h4 className="text-lg">{repo.repoSubTitle}</h4>
                  <p>프로젝트 기간</p>
                  <p>
                    {repo.repoStartDate} ~ {repo.repoEndDate}
                  </p>
                </div>
                <RadarChart scoreData={repo.commitScoreDto} />
                <ul className="card">
                  {Object.entries(repo.commitScoreDto)
                    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                    .map(([key, value]) => (
                      <li
                        key={key}
                        className={
                          key === "total"
                            ? "text-lg pt-1"
                            : key === "scoreComment"
                              ? "hidden"
                              : ""
                        }
                      >
                        {keyName[key as keyof typeof keyName]}:{" "}
                        {Number(value).toFixed(1)}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </section>
        </>
      ) : (
        <section className="text-center">분석을 진행한 적이 없습니다</section>
      )}
    </>
  );
}
