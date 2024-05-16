import { RepoAnalysisResponse } from "@/api/userPage/apiAnalysis";
import RadarChart from "./RadarChart";
import { useState } from "react";
import useCommonCodeStore from "@/store/commoncode";

export default function AnalysisCard({ data }: { data: RepoAnalysisResponse }) {
  const { response } = useCommonCodeStore.getState();
  const jobObj = response.result.commonCodeList[2].codes;
  const [selectedJob, setSelectedJob] = useState("2004");
  console.log(jobObj);
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
                {Object.entries(data.myScoreAverage)
                  .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                  .map(([key, value]) => (
                    <li
                      key={key}
                      className={key === "total" ? "text-lg pt-1" : ""}
                    >
                      {key}: {Number(value).toFixed(1)}
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
        <div className="gap-2">
          {jobObj && (
            <select
              onChange={(e) => {
                setSelectedJob(e.target.value);
                console.log(selectedJob);
              }}
              className="border hover:border-appBlue1"
              value={selectedJob}
            >
              {Object.keys(data.jobs).map((job) => (
                <option key={job} value={job}>
                  {jobObj[job]}
                </option>
              ))}
            </select>
          )}
          <h2>평균 분석 결과</h2>
        </div>
        {selectedJob && data.jobs[selectedJob] && (
          <ul>
            {Object.entries(data.jobs[selectedJob])
              .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
              .map(([key, value]) => (
                <li key={key} className={key === "total" ? "text-lg pt-1" : ""}>
                  {key}: {Number(value).toFixed(1)}
                </li>
              ))}
          </ul>
        )}
      </section>
    </article>
  );
}
