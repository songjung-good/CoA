import repositoryStore from "@/store/repos";

export default function UserRepositoryPage() {
  const repos = repositoryStore((state) => state.repos);
  return (
    <>
      <h1>User Repository Page</h1>
      <p>레포카드</p>
      {repos.map((repo, index) => (
        <div key={index}>
          <h2>{repo.name}</h2>
          <p>Total Lines of Code: {repo.totalLinesOfCode}</p>
          <div className="p-2">
            Languages:
            {Object.entries(repo.languages).map(([language, lines], index) => (
              <p key={index}>
                {language}: {lines}
              </p>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
