import repositoryStore from "@/store/repos";
import MyPageRepositoryCard from "./MyPageRepositoryCard";

export default function UserRepositoryPage() {
  const repos = repositoryStore((state) => state.repos);
  return (
    <>
      <ul>
        {repos.map((repo, index) => (
          <li key={index}>
            <MyPageRepositoryCard repo={repo} />
          </li>
        ))}
      </ul>
    </>
  );
}
