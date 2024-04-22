export default function UserPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>User Page ID: {params.id}</div>
  );
}
