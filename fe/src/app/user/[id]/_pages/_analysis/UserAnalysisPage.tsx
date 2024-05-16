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
  const [selectedJob, setSelectedJob] = useState("ALL");
  return (
    <>
      {data !== undefined ? (
        <>
          <AnalysisCard data={data} />
          {/* repos */}
          <section className="flex flex-col gap-4">
            {data.repos.map((repo) => (
              <div className="card flex gap-4" key={repo.repoViewId}>
                <div>
                  <h3>Repo ID: {repo.repoViewId}</h3>
                </div>
                <RadarChart scoreData={repo.commitScore} />
                <ul className="card">
                  {Object.entries(repo.commitScore)
                    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                    .map(([key, value]) => (
                      <li key={key}>
                        {key}: {Number(value).toFixed(1)}
                      </li>
                    ))}
                </ul>
                <div className="card">Comment: {repo.comment}</div>
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
