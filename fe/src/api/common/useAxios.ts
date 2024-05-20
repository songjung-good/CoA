"use client";
import axios, { AxiosInstance } from "axios";
import getServerUrl from "./getServerUrl";
const serverUrl = getServerUrl(); // 서버 URL 가져오기

const UseAxios = (): AxiosInstance => {

  const axiosInstance = axios.create({
    baseURL: serverUrl,
    withCredentials: true, // 쿠키를 담겠다는 의미
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      // var jwtToken = getCookie('JWT')
      // config.headers['Authorization'] = `Bearer ${jwtToken}`; // 인증 정보를 헤더에 추가
      return config;
    },
    async (error) => {
      console.log(error);
    },
  );

  axiosInstance.interceptors.response.use((response) => {
      if (response.data.code === 303) {
        return response
      } else if (response.data.code === 602) {
        return response
      }else if (response.data.code == 200) {
        return response
      }
      return response;  
    },
    async (error) => {
      const originalRequest = error.config;
      console.log(error)

      if (error.response.status === 401) { // 여기에 에러 처리 //  && !originalRequest._retry

        window.location.href = `/auth/login`
        // originalRequest._retry = true;

        // try { // 리프레시 로직 우리는 일단 api 인증토큰 로직을 넣어야 할 듯.
        //   const response = await axios.get(`${serverUrl}/api/token`, {
        //     headers: { authorization: localStorage.getItem('refreshToken') },
        //   });

        //   const newAccessToken = response.headers['authorization'];
        //   const newRefreshToken = response.headers['authorization-refresh'];

        //   localStorage.setItem('accessToken', newAccessToken);
        //   localStorage.setItem('refreshToken', newRefreshToken);

        //   originalRequest.headers['authorization'] = newAccessToken;

        //   return axiosInstance(originalRequest);
        // } catch (error) {
        //   console.error('Error refreshing token:', error);
        //   throw error;
        // }
      }

      // return Promise.reject(error);
    }
  )

  // axiosInstance.interceptors.response.use(
  //   (response) => {
  //     return response;
  //   },

  //   async (error) => {
  //     const originalRequest = error.config;

  //     if (error.response.status === 401 && !originalRequest._retry) { // 여기에 에러 처리
  //       originalRequest._retry = true;

  //       try { // 리프레시 로직 우리는 일단 api 인증토큰 로직을 넣어야 할 듯.
  //         const response = await axios.get(`${serverUrl}/api/token`, {
  //           headers: { authorization: localStorage.getItem('refreshToken') },
  //         });

  //         const newAccessToken = response.headers['authorization'];
  //         const newRefreshToken = response.headers['authorization-refresh'];

  //         localStorage.setItem('accessToken', newAccessToken);
  //         localStorage.setItem('refreshToken', newRefreshToken);

  //         originalRequest.headers['authorization'] = newAccessToken;

  //         return axiosInstance(originalRequest);
  //       } catch (error) {
  //         console.error('Error refreshing token:', error);
  //         throw error;
  //       }
  //     }

  //     return Promise.reject(error);
  //   }
  // );

  // 쿠키에서 지정된 이름의 값을 읽는 함수
  function getCookie(name: string | any[]) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        // 이 쿠키의 이름이 요청한 이름과 일치하는지 확인
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  return axiosInstance;
};

export default UseAxios;
