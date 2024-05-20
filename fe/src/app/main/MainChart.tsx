import MemberChart from "./chart/MemberChart";
import ReposChart from "./chart/ReposChart";

export default function MainChart() {
  return (
    <section className="card w-full max-w-screen-xl my-10 flex">
      <div className="flex-1">
        <MemberChart />
      </div>
      <div className="flex-1">
        <ReposChart />
      </div>
    </section>
  );
}
