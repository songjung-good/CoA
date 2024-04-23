export default function UserPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <h1>User Page ID: {params.id}</h1>
      <h1>개요</h1>
    </>
  );
}
