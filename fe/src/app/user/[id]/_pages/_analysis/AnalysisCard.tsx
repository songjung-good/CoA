import { RepoAnalysisResponse } from "@/api/userPage/apiAnalysis";
import RadarChart from "./RadarChart";
import { useState } from "react";

export default function AnalysisCard({ data }: { data: RepoAnalysisResponse }) {
  const [selectedJob, setSelectedJob] = useState("2000");
  return (
    <article className="card flex justify-center gap-4">
      <section>
        {data.myScoreAverage ? (
          <>
            <div className="flex gap-4">
              <RadarChart
                scoreData={data.myScoreAverage!}
                scoreData2={data.jobs[selectedJob]}
              />
              <ul className="card">
                <h2>나의 분석 결과</h2>
                {Object.entries(data.myScoreAverage).map(([key, value]) => (
                  <li
                    key={key}
                    className={key === "total" ? "text-lg pt-1" : ""}
                  >
                    {key}: {value}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="flex gap-4">
            <RadarChart scoreData={data.jobs[selectedJob]} />
            <ul className="card">
              <h2>나의 분석 결과</h2>
              <li>분석을 진행한 적이 없어요</li>
            </ul>
          </div>
        )}
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
        {selectedJob && data.jobs[selectedJob] && (
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
