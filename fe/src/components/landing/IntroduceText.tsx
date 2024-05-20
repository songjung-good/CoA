import React from "react";
import ReactDOM from "react-dom";
import tw from "tailwind-styled-components";

interface TypingTextProps {
  text: string;
  frame: number;
  setAnimeFinished: () => void;
  animeFinishFlag: boolean;
  flag?: boolean;
}

const TypingTextComponent: React.FC<TypingTextProps> = ({
  text,
  frame,
  setAnimeFinished,
  animeFinishFlag,
  flag = true,
}) => {
  const [typingText, setTypingText] = React.useState("");
  const textIndex = React.useRef(0);
  const lastTimeStamp = React.useRef<number | null>(null);

  const animationCallback = (timeStamp: number) => {
    if (lastTimeStamp.current === null) {
      lastTimeStamp.current = timeStamp;
    }

    const elapsedTime = timeStamp - lastTimeStamp.current;

    if (elapsedTime > frame) {
      lastTimeStamp.current = timeStamp;
      // textIndex.current가 text.length보다 작을 때만 문자를 추가
      if (textIndex.current < text.length) {
        setTypingText((prev) => prev + text[textIndex.current]);
        textIndex.current += 1;
      }
    }

    // 모든 텍스트 출력이 완료된 후에는 추가적인 애니메이션 호출을 중지
    if (textIndex.current < text.length) {
      requestAnimationFrame(animationCallback);
    } else {
      setAnimeFinished();
      // console.log("finish!");
    }
  };

  React.useEffect(() => {
    let animeId: number;
    if (animeFinishFlag) {
      setTypingText(text);
    } else if (flag) {
      animeId = requestAnimationFrame(animationCallback);
    }

    return () => {
      cancelAnimationFrame(animeId);
    };
  }, [text, frame, flag, animeFinishFlag]);

  return <p>{typingText}</p>;
};

const useTypingAnime = (text: string, frame: number, flag?: boolean) => {
  const [animeFinishFlag, setFlageState] = React.useState<boolean>(false);
  const setAnimeFinished = () => {
    setFlageState(true);
  };

  const TypingTextDiv = () => {
    return TypingTextComponent({
      text,
      frame,
      setAnimeFinished,
      animeFinishFlag,
      flag,
    });
  };

  return { animeFinishFlag, TypingTextDiv };
};

export default function IntroduceText() {
  const { animeFinishFlag: firstFlag, TypingTextDiv: FirstText } =
    useTypingAnime("내 코드는 좋은 코드일까?", 50);
  const { animeFinishFlag: secondFlag, TypingTextDiv: SecondText } =
    useTypingAnime("포트폴리오는 언제 만들지?", 50, firstFlag);
  const { animeFinishFlag: thirdFlag, TypingTextDiv: ThirdText } =
    useTypingAnime("프로젝트에서 내 기여도는 얼마일까?", 50, secondFlag);
  const { animeFinishFlag: fourthFlag, TypingTextDiv: FourthText } =
    useTypingAnime("CoA에서 한눈에 확인하세요!", 50, thirdFlag);
  // const { animeFinishFlag: fifthFlag, TypingTextDiv: FifthText } =
  //   useTypingAnime("CoA에서 한눈에 확인하세요!", 50, fourthFlag);
  return (
    <TextDiv>
      <FirstText />
      <SecondText />
      <ThirdText />
      <FourthText />
    </TextDiv>
  );
}

const TextDiv = tw.div`
  min-h-[19vh]
  text-center
  font-medium
  text-black
  lg:text-3xl
  md:text-xl
  sm:text-lg
`;
