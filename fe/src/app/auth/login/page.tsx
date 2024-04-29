'use client'

export default function LoginPage() {

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'; // OAuth는 fetch나 axios로 보낼 시 무조건 CORS에 막히는 듯
  };

  // GitHub 로그인 버튼 클릭 시 이벤트 핸들러
  const handleGitHubLogin = () => {
  };


  return (
    <main>
      <h1>LoginPage</h1>
      <div className="flex flex-col">
        <button onClick={handleGitHubLogin}>GitHub</button>
        <p></p>
        <button onClick={handleGoogleLogin}>Sign In Google</button>
      </div>
    </main>
  );
}
