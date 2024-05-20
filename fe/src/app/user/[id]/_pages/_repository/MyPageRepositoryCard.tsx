import { Repository } from "@/api/userPage/apiLinesOfCode";
import MyPageRepositoryCardChart from "./ChartPie";

export default function MyPageRepositoryCard({ repo }: { repo: Repository }) {
  return (
    <div className="">
      <div>
        <MyPageRepositoryCardChart
          languages={repo.languages}
          totalLinesOfCode={repo.totalLinesOfCode}
        />
      </div>
    </div>
  );
}
