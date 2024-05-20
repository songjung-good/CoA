import axios from "axios";
import UseAxios from "../common/useAxios";

// Contributions 타입 정의
export type Contribution = {
  date: string;
  count: number;
  level: number;
};

// API 응답 타입 정의
export type ApiResponse = {
  total: Record<string, number>;
  contributions: Contribution[];
};

export const getContributions = async (
  userId: string,
): Promise<ApiResponse> => {
  const response = await axios.get<ApiResponse>(
    `https://github-contributions-api.jogruber.de/v4/${userId}`,
  );
  return response.data;
};
const customAxios = UseAxios();
export const getGithubEventsData = async (
  memberUuid: string,
): Promise<ApiResponse | null> => {
  // console.log("깃허브");
  try {
    const response = await customAxios.get(
      `/api/external/events/github/${memberUuid}`,
    );
    // console.log(response);
    if (response.data.code === 200) {
      return response.data.result;
    } else {
      // console.log(response.data.result);
      return null;
    }
  } catch (error) {
    console.error("getGithubEventsData 요청 에러", error);
    return null;
  }
};

export const getGitlabEventsData = async (
  memberUuid: string,
): Promise<ApiResponse | null> => {
  // console.log("깃랩");
  try {
    const response = await customAxios.get(
      `/api/external/events/gitlab/${memberUuid}`,
    );
    // console.log(response);
    if (response.data.code === 200) {
      return response.data.result;
    } else {
      // console.log(response.data.result);
      return null;
    }
  } catch (error) {
    console.error("getGitlabEventsData 요청 에러", error);
    return null;
  }
};
