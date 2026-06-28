const style = {
  // backgroundColor: "#c6e5d9",
  width: "400px",
  // height: "200px",
  padding: "8px",
  // margin: "8px auto",
  borderRadius: "8px",
};

export const Login = (props) => {
  const { loginRequest } = props;

  return (
    <div style={style}>
      <h2>ログイン画面</h2>

      {/* エラー表示 */}
      {/* <button onClick={isloginError}>ログインエラー？</button> */}
      {/* {location.search == "?error" && (
        <div>
          <p style={{ color: "red" }}>usernameまたはpasswordが違います</p>
        </div>
      )} */}
      {/* ログアウト表示  */}
      {/* {location.search == "?logout" && (
        <div>
          <p style={{ color: "blue" }}>ログアウトしました</p>
        </div>
      )} */}

      <form
        // th:action="http://localhost:8080/authentication"
        // method="POST"
        // th:object="${loginForm}"
        id="loginForm"
      >
        <div>
          <label htmlFor="usernameInput">username</label>
          <input type="text" name="usernameInput" />
        </div>
        <div>
          <label htmlFor="passwordInput">password</label>
          <input type="password" name="passwordInput" />
        </div>
        {/* <label>
          Your email address:
          <input
            type="email"
            autocomplete="on"
            name="userid"
            placeholder="email"
            required
            size="32"
            maxlength="64"
          />
        </label> */}
      </form>
      <button onClick={loginRequest}>ログイン</button>
    </div>
  );
};
