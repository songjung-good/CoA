import { getUserAnalysisDummyData } from "@/api/userPage/apiAnalysis";
import userStore from "@/store/user";
import { useState } from "react";
import RadarChart from "./RadarChart";

export default function UserAnalysisPage() {
  const { UUID } = userStore();
  const fetchData = getUserAnalysisDummyData(UUID);
  const [data, setData] = useState(fetchData);
  const [selectedJob, setSelectedJob] = useState("ALL");
  return (
    <>
      <h1>User AnalysisPage</h1>

      <article className="card flex ">
        <section>
          {Object.entries(data.myScore).map(([user, scores]) => (
            <div key={user} className="flex">
              <RadarChart
                scoreData={scores}
                scoreData2={data.jobs[selectedJob]}
              />
              <ul>
                <h2>나의 분석 결과</h2>
                {Object.entries(scores).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        <section>
          <div className="flex gap-2">
            <select onChange={(e) => setSelectedJob(e.target.value)}>
              {Object.keys(data.jobs).map((job) => (
                <option key={job} value={job}>
                  {job}
                </option>
              ))}
            </select>
            <h2>평균 분석 결과</h2>
          </div>
          {selectedJob && (
            <ul>
              {Object.entries(data.jobs[selectedJob]).map(([key, value]) => (
                <li key={key}>
                  {key}: {value}
                </li>
              ))}
            </ul>
          )}
        </section>
      </article>
      {/* repos */}
      <section>
        <h2>Repos</h2>
        {data.repos.map((repo) => (
          <div className="card" key={repo.repoViewId}>
            <h3>Repo ID: {repo.repoViewId}</h3>
            <p>Comment: {repo.comment}</p>
            <h3>Commit Score</h3>
            {Object.entries(repo.commitScore).map(([key, value]) => (
              <p key={key}>
                {key}: {value}
              </p>
            ))}
          </div>
        ))}
      </section>
    </>
  );
}
