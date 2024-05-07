'use client'

import { useState } from 'react';

import UseAxios from '@/api/common/useAxios';


export default function LinkPage() {
  const serverUrl = process.env.NEXT_PUBLIC_URL_SERVER;
  const [githubToken, setGithubToken] = useState('');
  const [gitlabToken, setGitlabToken] = useState('');
  const axiosInstance = UseAxios();

  const handleGithubLogin = () => {
    window.location.href = `${serverUrl}/oauth2/authorization/github`;
  };

  const handleGitLabLogin = () => {
    window.location.href = `${serverUrl}/oauth2/authorization/gitlab`;
  };

  // 토큰을 사용하여 GitHub API에 요청을 보내는 함수
  const saveAccessTokenGithub = async () => {
    try {
      const response = await axiosInstance.post('/api/accountLink/github', {
        // 요청 본문 데이터 (필요한 경우)
      }, {
        headers: {
          'Access-Token': githubToken // githubToken 값을 'Access-Token' 헤더에 포함
        }
      });
      console.log('GitHub Token 저장 응답:', response.data);
      // 응답에서 'Access-Token' 헤더를 꺼내기
      const accessToken = response.headers['access-token']; // 헤더 이름은 소문자로 반환될 수 있습니다.
      if (accessToken) {
        // 로컬 스토리지에 토큰 저장
        sessionStorage.setItem('githubAccessToken', accessToken);
      } else {
        console.log('github access 토큰 반환 에러');
      }
    } catch (error) {
      console.error('GitHub Token 저장 중 오류가 발생했습니다:', error);  
    }
  };
  const saveAccessTokenGitLab = async () => {
    try {
      const response = await axiosInstance.post('/api/accountLink/gitlab', {
        // 요청 본문 데이터 (필요한 경우)
      }, {
        headers: {
          'Access-Token': githubToken // githubToken 값을 'Access-Token' 헤더에 포함
        }
      });
      console.log('GitLab Token 저장 응답:', response.data);
      // 응답에서 'Access-Token' 헤더를 꺼내기
      const accessToken = response.headers['access-token']; // 헤더 이름은 소문자로 반환될 수 있습니다.
      if (accessToken) {
        // 로컬 스토리지에 토큰 저장
        sessionStorage.setItem('gitlabAccessToken', accessToken);
      } else {
        console.log('gitlab access 토큰 반환 에러');
      }
        } catch (error) {
      console.error('Gitlab Token 저장 중 오류가 발생했습니다:', error);  
    }
  };

  return (
    <main>
      <h1>LinkPage</h1>
      <h4>계정 연동</h4>
      <div>
        <div>GitHub</div>
        <div>
          <button onClick={handleGithubLogin}>link to github</button>
          <div>
            <input
              type="text"
              value={githubToken}
              onChange={e => setGithubToken(e.target.value)}
            />
            <button onClick={saveAccessTokenGithub}>load token</button>
          </div>
        </div>
      </div>
      <div>
        <div>GitLab</div>
        <div>
          <button onClick={handleGitLabLogin}>link to gitlab</button>
          <div>
            <input
              type="text"
              value={gitlabToken}
              onChange={e => setGitlabToken(e.target.value)}
            />
            <button onClick={saveAccessTokenGitLab}>load token</button>
          </div>
        </div>
      </div>
    </main>
  );
}
