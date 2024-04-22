export default function RepoPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>RepoPage ID: {params.id}</div>
  );
}
