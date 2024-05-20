import { useState, useEffect } from "react";
import useRepoDetailStore from "@/store/repodetail";
import CommitRate from "@/app/repo/[id]/_components/CommitRate";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// Comment 타입 정의
interface Comment {
  commentStartIndex: number;
  commentEndIndex: number;
  commentContent: string;
  commentTargetString: string;
}

export default function ResultCommit() {
  const repo = useRepoDetailStore.getState().result.repoCardDto;
  const result = useRepoDetailStore.getState().result.basicDetailDto;
  const commentList: any = result.commentList || [];
  const [currentComment, setCurrentComment] = useState<Comment | null>(null);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const handleCommentClick = (
    comment: Comment,
    event: React.MouseEvent<HTMLSpanElement>,
  ) => {
    if (
      currentComment &&
      currentComment.commentContent === comment.commentContent
    ) {
      setCurrentComment(null);
      setModalPosition(null);
    } else {
      setCurrentComment(comment);
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setModalPosition({
        top: rect.top + window.scrollY + rect.height, // Adjust for scroll position
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        currentComment &&
        !document
          .querySelector(".modal-content")
          ?.contains(event.target as Node)
      ) {
        setCurrentComment(null);
        setModalPosition(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentComment]);

  const generateHtmlWithComments = (text: string, comments: Comment[]) => {
    let htmlString = "";
    let lastEnd = 0;
    const sortedComments = comments.sort(
      (a, b) => a.commentStartIndex - b.commentStartIndex,
    );

    sortedComments.forEach((comment, index) => {
      if (comment.commentStartIndex > lastEnd) {
        htmlString += text.slice(lastEnd, comment.commentStartIndex);
      }
      htmlString += `<span class="comment" data-index="${index}" style="color: #48CAF8; cursor: pointer;">${text.slice(comment.commentStartIndex, comment.commentEndIndex)}</span>`;
      lastEnd = comment.commentEndIndex;
    });

    if (lastEnd < text.length) {
      htmlString += text.slice(lastEnd);
    }

    return htmlString;
  };

  const handleSpanClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    const target = event.target as HTMLSpanElement;
    const index = target.getAttribute("data-index");
    if (index !== null) {
      handleCommentClick(commentList[parseInt(index)], event);
    }
  };

  const totalLineCount = result.repoLineCntList.reduce(
    (acc, line) => acc + line.lineCnt,
    0,
  );

  const pieData = {
    labels: result.repoLineCntList.map((line) => line.codeName),
    datasets: [
      {
        data: result.repoLineCntList.map((line) => line.lineCnt),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw || 0;
            return `${label}: ${value} 줄`;
          },
        },
      },
    },
    cutout: "40%",
  };

  return (
    <div className="flex flex-col w-full justify-between">
      <div className="flex flex-col justify-between items-center min-h-80">
        <CommitRate />
        <div className="w-full max-w-[80%] sm:max-w-[40%] min-h-[300px] flex flex-col items-center justify-center relative">
          <Pie data={pieData} options={pieOptions} />
          <div className="">
            <p className="font-bold my-4">
              전체 코드 :{" "}
              <span className="text-appBlue1">{totalLineCount}</span> 줄
            </p>
          </div>
        </div>
      </div>
      <p className="text-base sm:text-xl lg:text-2xl mt-2">
        <span className="text-appBlue1">{repo.memberNickname}</span> 님의{" "}
        <span className="text-appBlue1">{repo.repoViewTitle}</span> 프로젝트
        분석결과
      </p>
      <div className="flex justify-center items-center w-full min-h-20 bg-white shadow-lg rounded-lg mt-2 text-xl lg:text-xl py-8 px-4">
        <div className="w-full flex justify-center">
          <span
            onClick={handleSpanClick}
            dangerouslySetInnerHTML={{
              __html: generateHtmlWithComments(
                result.repoViewResult,
                commentList,
              ),
            }}
            style={{ whiteSpace: "pre-wrap" }}
            className=" leading-relaxed"
          />
          {currentComment && modalPosition && (
            <div
              className="absolute bg-white p-4 shadow-lg rounded-lg border border-gray-300 text-gray-800 text-left min-w-[350px] w-fit break-words cursor-pointer modal-content"
              style={{
                top: `${modalPosition.top}px`,
                left: `${modalPosition.left}px`,
                transform: "translateX(-50%)",
              }}
              onClick={() => setCurrentComment(null)}
            >
              <p className="font-semibold w-full">{`${currentComment.commentTargetString} 코멘트`}</p>
              <p className="mt-2 text-sm">{`${currentComment.commentContent}`}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
