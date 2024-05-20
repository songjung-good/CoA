import { ApiResponse, Contribution } from "@/api/userPage/apiContributions";

export const mergeCalendarData = (
  res1: ApiResponse | null,
  res2: ApiResponse | null,
): ApiResponse | null => {
  // res1과 res2를 합치기 위한 작업
  const mergedContributions: Contribution[] = [];
  if (res1 === null && res2 === null) {
    return null;
  }
  // res1의 contributions가 존재하는지 확인
  if (res1 && res1.contributions) {
    // res1의 contributions를 먼저 병합
    res1.contributions.forEach((contribution1) => {
      const existingContribution = mergedContributions.find(
        (c) => c.date === contribution1.date,
      );
      if (existingContribution) {
        // 이미 있는 날짜의 contribution인 경우 count와 level 값을 더해줌
        existingContribution.count += contribution1.count;
        existingContribution.level += contribution1.level;
      } else {
        // 새로운 날짜의 contribution인 경우 그대로 추가
        mergedContributions.push({ ...contribution1 });
      }
    });
  }

  // res1의 contributions가 존재하는지 확인
  if (res2 && res2.contributions) {
    // res2의 contributions를 병합
    res2.contributions.forEach((contribution2) => {
      const existingContribution = mergedContributions.find(
        (c) => c.date === contribution2.date,
      );
      if (existingContribution) {
        // 이미 있는 날짜의 contribution인 경우 count와 level 값을 더해줌
        existingContribution.count += contribution2.count;
        existingContribution.level += contribution2.level;
      } else {
        // 새로운 날짜의 contribution인 경우 그대로 추가
        mergedContributions.push({ ...contribution2 });
      }
    });
  }
  // total 값은 res1과 res2의 total 값을 합침
  const mergedTotal: Record<string, number> = {};
  // res1의 total이 존재하는지 확인
  if (res1 && res1.total) {
    Object.keys(res1.total).forEach((key) => {
      mergedTotal[key] = res1.total[key];
    });
  }
  if (res2 && res2.total) {
    Object.keys(res2.total).forEach((key) => {
      mergedTotal[key] = (mergedTotal[key] || 0) + res2.total[key];
    });
  }
  return {
    total: mergedTotal,
    contributions: mergedContributions,
  };
};

export default mergeCalendarData;
