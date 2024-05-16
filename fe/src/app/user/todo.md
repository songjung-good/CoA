// https://github-contributions-api.jogruber.de/v4/Shin-3117

/_
깃랩 기여 가져오기 (토큰 필요 PRIVATE-TOKEN)
https://lab.ssafy.com/api/v4/users/qsc3117/events
_/

선택된 TabBar 색 변경되게 0

잔디 컴포넌트 선택된 년도 색 변경되게 0

- CalendarCard.tsx에 연동된 사이트 표시 0
- 연동 페이지 만들기 0
- 로딩 전후, svg 랜더로 덜컹거리는거 고치기 0

레포지토리에 내가 한 것만 나오게 0 : 0502 forked 제거

- 레포 연혁 차트 클릭시 해당 레포지토리 정보 띄우기 (레포 페이지 완성후 추가 예정)

- runChart x축에 따라 회색줄 추가 (굳이?)
- 년-월 데이터 추가 0

런차트 구현 중 얕은 복사 문제 해결 0

```ts
// 얕은 복사로 원본 값에 영향을 미침
const newData = [...prevData, ...data[index].languages];

const currentData = newData.reduce((acc: LanguageData[], cur) => {
  const existingLanguage = acc.find(
    (item: LanguageData) => item.language === cur.language,
  );

  if (existingLanguage) {
    existingLanguage.value += cur.value;
  } else {
    acc.push(cur);
  }

  return acc;
}, []);
setPrevData(currentData);
```

```ts
const newData = [...prevData, ...data[index].languages];

const currentData = newData.reduce((acc: LanguageData[], cur) => {
  const existingLanguage = acc.find(
    (item: LanguageData) => item.language === cur.language,
  );

  if (existingLanguage) {
    existingLanguage.value += cur.value;
  } else {
    acc.push({ ...cur });
  }

  return acc;
}, []);
setPrevData(JSON.parse(JSON.stringify(currentData)));
```
