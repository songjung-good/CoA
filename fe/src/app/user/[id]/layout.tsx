import MyUserCard from "@/components/usercard/MyUserCard";

export default function UserPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-appGrey1 flex flex-col justify-center items-center">
      <div className="max-w-screen-xl w-full flex flex-col py-4 gap-4">
        <MyUserCard />
        {children}
      </div>
    </main>
  );
}
