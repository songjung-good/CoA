import { getTotalLinesOfCode } from "@/api/userPage/apiCodeLines";
import ChartLinesOfCode from "./LinesOfCodeChart";

const LinesOfCodeCard = () => {
  // 언어별 코드 줄 수 출력
  // const codeLines = getTotalLinesOfCode()
  //   .then((linesOfCode) => {
  //     console.log("언어별 코드 줄 수:");
  //     console.log(linesOfCode);
  //   })
  //   .catch((error) => {
  //     console.error("Error calculating total lines of code:", error);
  //   });
  const linesOfCode = {
    JavaScript: 298655,
    Vue: 32934,
    Java: 30654,
    Python: 15358,
    CSS: 12650,
    TypeScript: 10722,
    HTML: 6596,
    Shell: 3984,
    "C++": 3098,
    Dart: 2485,
    Swift: 288,
    C: 256,
    Kotlin: 20,
    "Objective-C": 4,
  };
  // const data1 = Object.entries(linesOfCode).map(([letter, frequency]) => ({
  //   letter,
  //   frequency,
  // }));

  // console.log(data1);
  return (
    <section className="card">
      <p>사용 언어 통계</p>
      <ChartLinesOfCode />
      {/* <ul>
        {Object.entries(linesOfCode).map(([key, value], index) => (
          <li key={index}>
            {key}: {value}
          </li>
        ))}
      </ul> */}
    </section>
  );
};

export default LinesOfCodeCard;
