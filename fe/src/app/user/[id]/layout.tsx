import UserCard from "@/components/UserCard/UserCard";
import UserPageTabBar from "./_components/UserPageTabBar";

export default function UserPageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { id: string };
}>) {
  return (
    <main>
      <UserCard />
      <UserPageTabBar />
      {params.id}
      {children}
    </main>
  );
}

// {
//   params,
// }: {
//   params: { id: string };
// }
