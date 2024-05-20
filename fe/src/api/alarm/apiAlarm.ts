import UseAxios from "../common/useAxios";

interface getAlarmCountDataResponse {
  isSuccess: boolean;
  message: string;
  code: number;
  result: number;
}

export interface Alarm {
  memberUuid: number;
  memberNickName: string;
  repoViewId: number;
  repoViewTitle: string;
  createAt: string;
}

interface getAlarmDataResponse {
  isSuccess: boolean;
  message: string;
  code: number;
  result: Alarm[];
}

const axiosInstance = UseAxios();

export const getAlarmCountData = async () => {
  try {
    const response = await axiosInstance.get<getAlarmCountDataResponse>(
      "/api/member/alarms/count",
    );
    // console.log(response.data.result);
    return response.data.result;
  } catch (error) {
    console.error("'/api/common/code'요청 에러", error);
    return 0;
  }
};

export const getAlarmData = async () => {
  try {
    const response =
      await axiosInstance.get<getAlarmDataResponse>("/api/member/alarms");
    // console.log(response.data.result);
    return response.data.result;
  } catch (error) {
    console.error("'/api/common/code'요청 에러", error);
    return [];
  }
};
