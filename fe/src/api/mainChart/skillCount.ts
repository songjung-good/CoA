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
export const getReposSkillsData = async (UUID: string) => {
  const response = await axios.get(`/api/repos/skill-count`);
  // console.log("getReposSkillsData");
  // console.log(response);
  const data: Response = response.data.result;
  return data;
};

export const getMembersSkillsData = async (UUID: string) => {
  const response = await axios.get(`/api/member/skill-count`);
  // console.log("getMembersSkillsData");
  // console.log(response);
  const data: Response = response.data.result;
  return data;
};
