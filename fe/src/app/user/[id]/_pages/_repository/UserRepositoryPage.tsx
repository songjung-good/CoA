import repositoryStore from "@/store/repos";
import MyPageRepositoryCard from "./MyPageRepositoryCard";
import HistoryCard from "../../_components/HistoryCard";
import MyRepoCard from "./MyRepo";

export default function UserRepositoryPage() {
  const repos = repositoryStore((state) => state.repos);
  return (
    <>
      <HistoryCard />
      <ul className="grid gap-3">
        {repos.map((repo, index) => (
          <li key={index}>
            <MyRepoCard data={repo} />
            {/* <MyPageRepositoryCard repo={repo} /> */}
          </li>
        ))}
      </ul>
    </>
  );
}
