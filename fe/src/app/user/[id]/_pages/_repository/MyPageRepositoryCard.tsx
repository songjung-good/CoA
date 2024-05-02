import { Repository } from "@/api/userPage/apiLinesOfCode";
import MyPageRepositoryCardChart from "./ChartPie";

export default function MyPageRepositoryCard({ repo }: { repo: Repository }) {
  return (
    <div className="card">
      <div className="md:flex justify-between items-end">
        <h2 className="text-2xl">{repo.name}</h2>
        <p>
          기간 : {new Date(repo.createdAt).toLocaleDateString()} ~
          {new Date(repo.pushedAt).toLocaleDateString()}
        </p>
        {/* <p>Created At: {repo.createdAt}</p>
        <p>Last Pushed At: {repo.pushedAt}</p>
        <p>Last Updated At: {repo.updatedAt}</p> */}
      </div>
      <div>
        <MyPageRepositoryCardChart
          languages={repo.languages}
          totalLinesOfCode={repo.totalLinesOfCode}
        />
      </div>
    </div>
  );
}
