import UserCard from "@/components/UserCard/UserCard";

export default function UserPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <UserCard />
      {children}
    </main>
  );
}
