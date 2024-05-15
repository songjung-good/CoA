import UseAxios from "../common/useAxios";

interface GithubLOC {
  isSuccess: boolean;
  message: string;
  code: number;
  result: [
    {
      additionalProp1: {};
      additionalProp2: {};
      additionalProp3: {};
    },
  ];
}
export const getGithubLOCData = async (memberUuid: string) => {
  // console.log("깃허브");
  try {
    const response = await UseAxios().get(
      `/api/external/github/${memberUuid}/lines-of-code`,
    );
    // console.log(response);
    return response.data.result;
  } catch (error) {
    console.error(
      `getGithubLOCData 요청 에러 / memberUuid :${memberUuid}`,
      error,
    );
  }
};
