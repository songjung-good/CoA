import UserCard from "@/components/usercard/UserCard";

export default function UserPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-appGrey1 p-4 flex flex-col gap-4">
      <UserCard />
      {children}
    </main>
  );
}
