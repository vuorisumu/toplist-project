import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../util/UserContext";

/**
 * Reusable login component that renders input fields for the
 * username and password, as well as a login button.
 *
 * @returns {JSX.Element} Login component
 */
function Login({ toggleLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, login, logout } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      document.getElementById("loginCont").classList.remove("active");
      document.getElementById("navLogin").classList.remove("active");
      setUsername("");
      setPassword("");
    }
  }, [user]);

  /**
   * Handles login attempt, clears the password field on unsuccessful
   * login attempt.
   */
  const handleLogin = async () => {
    if (username === "" || password === "") return;

    try {
      const loginData = {
        user: username,
        password: password,
      };
      await login(loginData);
      toggleLogin();
    } catch (err) {
      console.error("Error during login: " + err);
    }
  };

  /**
   * Checks if enter key was pressed when an input field was active,
   * and calls for login attempt if enter key was pressed
   * @param {KeyboardEvent} e - Keyboard event containing information of the pressed key
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  /**
   * Logs the user out, clears localStorage and refreshes the page.
   */
  const onLogout = () => {
    logout();
  };

  return (
    <>
      <div id="loginCont">
        <div>
          {!user ? (
            <>
              <label>User: </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <label>Password: </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <button
                type="button"
                onClick={handleLogin}
                className="loginButton"
              >
                Login
              </button>

              <Link to="/register" onClick={toggleLogin}>
                Register
              </Link>
            </>
          ) : (
            <>
              <p>
                {`Logged in as `}
                <Link to={`/user/${user.user_name}`} onClick={toggleLogin}>
                  {user.user_name}
                </Link>
              </p>
              <button type="button" onClick={onLogout} className="logoutButton">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
