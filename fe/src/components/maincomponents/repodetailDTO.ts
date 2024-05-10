const dummyData1 = {
  isSuccess: true,
  message: "Success message",
  code: 200,
  result: {
    repoCardDto: {
      memberId: 123,
      memberNickname: "John Doe",
      memberImg: "https://example.com/john-doe.jpg",
      repoViewId: 456,
      repoViewPath: "/projects/project-1",
      repoViewTitle: "Project 1",
      repoViewSubtitle: "Description of project 1",
      repoMemberCnt: 3,
      skillList: [
        { codeId: 1, codeName: "React" },
        { codeId: 2, codeName: "JavaScript" },
        { codeId: 3, codeName: "HTML" }
      ],
      repoStartDate: "2024-05-01",
      repoEndDate: "2024-06-01",
      isMine: true
    },
    basicDetailDto: {
      repoReadme: "This is the README file for Project 1.",
      repoViewResult: "Project 1 was successfully completed.",
      commentList: [
        { commentStartIndex: 0, commentEndIndex: 10, commentContent: "Great work!" },
        { commentStartIndex: 11, commentEndIndex: 20, commentContent: "Keep it up!" }
      ],
      repoViewTotalCommitCnt: 100,
      repoViewCommitCnt: 50,
      repoViewMemberCnt: 5,
      repoLineCntList: [
        { codeName: "React", lineCnt: 500 },
        { codeName: "JavaScript", lineCnt: 700 },
        { codeName: "HTML", lineCnt: 300 }
      ]
    },
    commitScoreDto: {
      readability: 90,
      performance: 85,
      reusability: 80,
      testability: 95,
      exception: 75,
      total: 87,
      scoreComment: "Overall, the code quality is good."
    }
  },
  setIsMine: () => {},
  setIsOther: () => {},
  updateResultState: () => {}
};
