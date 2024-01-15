import { useEffect, useState } from "react";
import { login } from "./api";
import { checkCreatorStatus } from "./util";

/**
 * Reusable login component that renders input fields for the
 * username and password, as well as a login button.
 */
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    if (checkCreatorStatus()) {
      setLoggedIn(true);
      setRole(localStorage.getItem("role"));
    } else {
      setLoggedIn(false);
    }
  }, []);

  /**
   * Handles login attempt, clears the password field on unsuccessful
   * login attempt.
   */
  const handleLogin = async () => {
    if (username === "" || password === "") return;

    try {
      const loginData = {
        role: username,
        password: password,
      };

      const res = await login(loginData);
      if (!res.error) {
        // successfully log in
        onLogin(username);
      } else {
        // clear password
        setPassword("");
      }
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
   * Logs in to a specific role and sets the login information to localStorage
   * @param {string} role - the role that was logged in to
   */
  const onLogin = async (role) => {
    localStorage.setItem("admin", role === "admin" ? "true" : "false");
    localStorage.setItem("login", "true");
    localStorage.setItem("role", role);
    window.location.reload(false);
  };

  /**
   * Logs the user out, sets the information to localStorage
   */
  const onLogout = () => {
    // store logout
    localStorage.setItem("admin", "false");
    localStorage.setItem("login", "false");
    localStorage.setItem("role", "");
    window.location.reload(false);
  };

  return (
    <>
      {!loggedIn ? (
        <div>
          <label>User: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <br />
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button type="button" onClick={handleLogin} className="loginButton">
            Login
          </button>
        </div>
      ) : (
        <div>
          <p>{`Logged in as ${role}`}</p>
          <button type="button" onClick={onLogout} className="logoutButton">
            Logout
          </button>
        </div>
      )}
    </>
  );
}

export default Login;
