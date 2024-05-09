import { RepoAnalysisResponse } from "@/api/userPage/apiAnalysis";
import RadarChart from "./RadarChart";
import { useState } from "react";

export default function AnalysisCard({ data }: { data: RepoAnalysisResponse }) {
  const [selectedJob, setSelectedJob] = useState("ALL");
  return (
    <article className="card flex justify-center gap-4">
      <section>
        {Object.entries(data.myScore).map(([user, scores]) => (
          <div key={user} className="flex gap-4">
            <RadarChart
              scoreData={scores}
              scoreData2={data.jobs[selectedJob]}
            />
            <ul className="card">
              <h2>나의 분석 결과</h2>
              {Object.entries(scores).map(([key, value]) => (
                <li key={key} className={key === "total" ? "text-lg pt-1" : ""}>
                  {key}: {value}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section className="card">
        <div className="flex gap-2">
          <select
            onChange={(e) => setSelectedJob(e.target.value)}
            className="border hover:border-appBlue1"
          >
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
              <li key={key} className={key === "total" ? "text-lg pt-1" : ""}>
                {key}: {value}
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
