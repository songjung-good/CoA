import UserCard from "@/components/usercard/UserCard";

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
