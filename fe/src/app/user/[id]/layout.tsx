import UserCard from "@/components/UserCard/UserCard";
import UserPageTabBar from "./_components/UserPageTabBar";

export default function UserPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <UserCard />
      <UserPageTabBar />
      {children}
    </main>
  );
}
