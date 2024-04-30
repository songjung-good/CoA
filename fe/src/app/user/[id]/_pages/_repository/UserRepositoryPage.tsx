import repositoryStore from "@/store/repos";
import MyPageRepositoryCard from "./MyPageRepositoryCard";
import HistoryChart from "../../_components/HistoryChart";

export default function UserRepositoryPage() {
  const repos = repositoryStore((state) => state.repos);
  return (
    <>
      <HistoryChart/>
      <ul className="grid gap-3">
        {repos.map((repo, index) => (
          <li key={index}>
            <MyPageRepositoryCard repo={repo} />
          </li>
        ))}
      </ul>
    </>
  );
}
