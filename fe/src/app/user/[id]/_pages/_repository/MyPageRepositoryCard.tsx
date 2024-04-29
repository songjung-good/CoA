import { Repository } from "@/api/userPage/apiLinesOfCode";
import MyPageRepositoryCardChart from "./ChartPie";

export default function MyPageRepositoryCard({ repo }: { repo: Repository }) {
  return (
    <div className="bg-appGrey1 rounded-2xl p-4">
      <div className="flex justify-between items-end">
        <h2 className="text-2xl">{repo.name}</h2>
        <p>
          기간 : {new Date(repo.createdAt).toLocaleDateString()} ~
          {new Date(repo.pushedAt).toLocaleDateString()}
        </p>
        {/* <p>Created At: {repo.createdAt}</p>
        <p>Last Pushed At: {repo.pushedAt}</p>
        <p>Last Updated At: {repo.updatedAt}</p> */}
      </div>
      <p>Total Lines of Code: {repo.totalLinesOfCode}</p>
      <div className="p-2">
        Languages:
        {Object.entries(repo.languages).map(([language, lines], index) => (
          <p key={index}>
            {language}: {lines}
          </p>
        ))}
        <MyPageRepositoryCardChart repo={repo.languages} />
        {/* <PieChart data={repo.languages} /> */}
      </div>
    </div>
  );
}
