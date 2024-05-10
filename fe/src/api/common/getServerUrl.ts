'use client'
const getServerUrl = () => {
    if (typeof window === "undefined") {
      // 서버 사이드에서 실행되는 경우
      return "http://localhost:8080"; // 또는 다른 기본 URL
    }
    const hostname = window.location.hostname; // 현재 도메인 이름을 가져옵니다.
    if (hostname === "localhost") {
        return "http://localhost:8080";
    } else {
        return window.location.protocol + "//" + hostname;
    }
};

export default getServerUrl;