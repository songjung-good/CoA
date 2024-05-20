import UseAxios from "../common/useAxios";

interface SkillCount {
  codeName: string;
  cnt: number;
}

interface Response {
  isSuccess: boolean;
  message: string;
  code: number;
  result: SkillCount[];
}
const axios = UseAxios();
export const getReposSkillsData = async () => {
  const response = await axios.get(`/api/repos/skill-count`);
  // console.log("getReposSkillsData");
  // console.log(response);
  const data: SkillCount[] = response.data.result;
  return data;
};

export const getMembersSkillsData = async () => {
  const response = await axios.get(`/api/member/skill-count`);
  // console.log("getMembersSkillsData");
  // console.log(response);
  const data: SkillCount[] = response.data.result;
  return data;
};
