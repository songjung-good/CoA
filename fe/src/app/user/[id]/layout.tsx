import UserCard from "@/components/usercard/UserCard";

export default function UserPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-appGrey1 flex flex-col justify-center items-center">
      <div className="max-w-screen-xl flex flex-col py-4 gap-4">
        <UserCard />
        {children}
      </div>
    </main>
  );
}
