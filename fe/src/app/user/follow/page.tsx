import FollowList from "./FollowList";

export default function FollowPage() {
  return (
    <main className="bg-appGrey1 flex flex-col justify-center items-center">
      <div className="max-w-screen-xl w-full flex flex-col py-4 gap-4">
        <FollowList />
      </div>
    </main>
  );
}
