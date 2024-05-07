'use client'

import { useState, useEffect } from 'react';

import UseAxios from '@/api/common/useAxios';


export default function LinkPage() {
  const serverUrl = process.env.NEXT_PUBLIC_URL_SERVER;
  // 입력 받을 변수
  const [githubToken, setGithubToken] = useState('');
  const [gitlabToken, setGitlabToken] = useState('');
  const [solvedacNickName, setSolvedacNickName] = useState('');
  const [codeforcesNickName, setCodeforcesNickName] = useState('');

  // 반환 받을 변수
  const [hubNickName, setHubNickName] = useState('');
  const [labNickName, setLabNickName] = useState('');
  const [isHubToken, setIsHubToken] = useState('');
  const [isLabToken, setIsLabToken] = useState('');

  const [sacNickName, setSacNickName] = useState('');
  const [cofNickName, setCofNickName] = useState('');

  const axiosInstance = UseAxios();

  // fetchData 함수 정의
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('api/accountLink');

      console.log(response.data)
      console.log(response.data.result)
      const getData = response.data.result

      setHubNickName(getData.githubNickName)
      setIsHubToken(getData.isGithubToken)

      setLabNickName(getData.gitlabNickName)
      setIsLabToken(getData.isGitlabToken)

      setSacNickName(getData.solvedacNickName)
      setCofNickName(getData.codeforcesNickName)
      
      
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // 컴포넌트가 마운트될 때 fetchData를 실행
  useEffect(() => {
    fetchData();
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때만 fetchData를 호출


  const handleGithubLogin = () => {
    window.location.href = `${serverUrl}/oauth2/authorization/github`;
  };

  const handleGitLabLogin = () => {
    window.location.href = `${serverUrl}/oauth2/authorization/gitlab`;
  };

  const saveAccessTokenGithub = async () => {
    try {
      const response = await axiosInstance.post('/api/accountLink/github', {
        // 요청 본문 데이터 (필요한 경우)
      }, {
        headers: {
          'Access-Token': githubToken // githubToken 값을 'Access-Token' 헤더에 포함
        }
      });
      setGithubToken('');
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
      setGitlabToken('')
        } catch (error) {
      console.error('Gitlab Token 저장 중 오류가 발생했습니다:', error);  
    }
  };

  const saveNickNameSolvedac = async () => {
    try {
      const response = await axiosInstance.post('/api/accountLink/solvedac', {
        nickName : solvedacNickName
      },
      );
      setSacNickName(response.data.result)
      setSolvedacNickName('')
    } catch (error) {
      console.error('saveNickNameSolvedac 저장 중 오류가 발생했습니다:', error);  
    }
  };
  const saveNickNameCodeforces = async () => {
    try {
      const response = await axiosInstance.post('/api/accountLink/codeforces', {
        nickName : codeforcesNickName
      },
      );
      setCofNickName(response.data.result)
      setCodeforcesNickName('')
    } catch (error) {
      console.error('saveNickNameCodeforces 저장 중 오류가 발생했습니다:', error);  
    }
  };
  return (
    <main>
      <h1>LinkPage</h1>
      <h4>계정 연동</h4>
      <div>
        <div>GitHub</div>
        <div>
          <div>{hubNickName}</div>
          <div>{isHubToken}</div>
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
          <div>{labNickName}</div>
          <div>{isLabToken}</div>
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

      <div>
        <div>solvedAC</div>
        <div>{sacNickName}</div>
        <input
          type="text"
          value={solvedacNickName}
          onChange={e => setSolvedacNickName(e.target.value)}
        />
        <button onClick={saveNickNameSolvedac}>닉네임 연동하기</button>
      </div>
      <div>
        <div>Codeforces</div>
        <div>{cofNickName}</div>
        <input
          type="text"
          value={codeforcesNickName}
          onChange={e => setCodeforcesNickName(e.target.value)}
        />
        <button onClick={saveNickNameCodeforces}>닉네임 연동하기</button>
      </div>
    </main>
  );
}
