import axios from "axios";

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
