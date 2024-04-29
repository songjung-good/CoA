'use client'


function generateState(): string {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  const state = array[0].toString(16);
  sessionStorage.setItem('oauth_state', state);
  return state;
}


export default function LoginPage() {

  // const handleGoogleLogin = () => {

  //   const state = generateState();

  //   const clientId = '765601865422-gfbpej2d4oequfvi35v14j6cba5iafvr.apps.googleusercontent.com';
  //   const redirectUri = 'http://localhost:8080/login/oauth2/code/google';
  //   const scope = 'email profile';
  //   const responseType = 'code';
  //   const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&state=${state}`;
  //   // const authUrl = `https://accounts.google.com/o/oauth2/v2/authorization?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&state=${state}`;

  //   window.location.href = authUrl;
  // };


  const handleGoogleLogin = () => {
    fetch('http://localhost:8080/api/auth/google/start')
      .then(response => response.json())
      .then(data => {
        window.location.href = data.url;
      })
      .catch(error => console.error('Error:', error));
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
