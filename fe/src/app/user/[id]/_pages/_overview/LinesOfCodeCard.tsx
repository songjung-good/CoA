import ChartLinesOfCode from "./LinesOfCodeChart";

const LinesOfCodeCard = () => {
  return (
    <section className="card">
      <p>사용 언어 통계</p>
      <ChartLinesOfCode />
    </section>
  );
};

export default LinesOfCodeCard;
