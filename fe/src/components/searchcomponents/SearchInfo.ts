const RepoCardDTO =
[
  {
    "memberId": 1,
    "memberNickName": "songjung-good",
    "memberImg": "https://example.com/image.jpg",
    "repoViewId": 1,
    "repoViewTitle": "My First Repository",
    "repoViewSubTitle": "This is a subtitle",
    "skillList": ["JavaScript", "React"],
    "dateRange": {
      "startDate": "2022-01-01",
      "endDate": "2022-12-31"
    },
    "isMine": true
  },
  {
    "memberId": 2,
    "memberNickName": "another-user",
    "memberImg": "https://example.com/image2.jpg",
    "repoViewId": 2,
    "repoViewTitle": "Another Repository",
    "repoViewSubTitle": "Another subtitle",
    "skillList": ["Python", "Django"],
    "dateRange": {
      "startDate": "2022-01-01",
      "endDate": "2022-12-31"
    },
    "isMine": false
  }
]

export default RepoCardDTO;
