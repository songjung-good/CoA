import { getUserAnalysisDummyData } from "@/api/userPage/apiAnalysis";
import userStore from "@/store/user";
import { useState } from "react";
import RadarChart from "./RadarChart";
import AnalysisCard from "./AnalysisCard";

export default function UserAnalysisPage() {
  const { UUID } = userStore();
  const fetchData = getUserAnalysisDummyData(UUID);
  const [data, setData] = useState(fetchData);
  const [selectedJob, setSelectedJob] = useState("ALL");
  return (
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
              {Object.entries(repo.commitScore).map(([key, value]) => (
                <li key={key}>
                  {key}: {value}
                </li>
              ))}
            </ul>
            <div className="card">Comment: {repo.comment}</div>
          </div>
        ))}
      </section>
    </>
  );
}
