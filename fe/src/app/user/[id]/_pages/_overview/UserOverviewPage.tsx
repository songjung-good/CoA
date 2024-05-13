import CalendarCard from "../../_components/CalendarCard";
import CodeLinesCard from "./LinesOfCodeCard";

export default function UserOverviewPage({ uuid }: { uuid: string }) {
  return (
    <>
      <CalendarCard uuid={uuid} />
      <CodeLinesCard />
    </>
  );
}
