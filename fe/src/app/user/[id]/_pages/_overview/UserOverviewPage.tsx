import CalendarCard from "./CalendarCard";
import CodeLinesCard from "./LinesOfCodeCard";

export default function UserOverviewPage({ uuid }: { uuid: string }) {
  return (
    <>
      <CalendarCard uuid={uuid} />
      <CodeLinesCard />
    </>
  );
}
