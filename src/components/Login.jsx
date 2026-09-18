const style = {
};

export const Login = (props) => {
  const { loginRequest } = props;

  return (
    <div className="login-area">
      <h2>ログイン画面</h2>
      <form id="loginForm">
        <div>
          <label htmlFor="usernameInput">username</label>
          <input type="text" name="usernameInput" />
        </div>
        <div>
          <label htmlFor="passwordInput">password</label>
          <input type="password" name="passwordInput" />
        </div>
      </form>
      <br></br>
      <button onClick={loginRequest}>ログイン</button>
    </div>
  );
};
