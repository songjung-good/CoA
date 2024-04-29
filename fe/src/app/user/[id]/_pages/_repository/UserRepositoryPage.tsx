import repositoryStore from "@/store/repos";
import MyPageRepositoryCard from "../../_components/MyPageRepositoryCard";

export default function UserRepositoryPage() {
  const repos = repositoryStore((state) => state.repos);
  return (
    <>
      <h1>User Repository Page</h1>
      <ul>
        {repos.map((repo, index) => (
          <li key={index} className="p-4">
            <MyPageRepositoryCard repo={repo} />
          </li>
        ))}
      </ul>
    </>
  );
}
