import UserCard from "@/components/UserCard/UserCard";

export default function UserPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <h1>User Page ID: {params.id}</h1>
    </>
  );
}
