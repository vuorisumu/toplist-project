import { useEffect, useState } from "react";
import { auth, login, userLogin } from "./api";
import { checkCreatorStatus } from "./util";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

/**
 * Reusable login component that renders input fields for the
 * username and password, as well as a login button.
 */
function Login({ isFixed }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("login")) {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      setRole(sessionStorage.getItem("user"));
    }
  }, [loggedIn]);

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

      const res = await userLogin(loginData);
      console.log(res);
      if (!res.error) {
        // successfully log in
        sessionStorage.setItem("token", res.token);
        const credentials = await auth();
        onLogin(credentials, res.user_name, res.email);
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
   * Logs in to a specific account and sets the login information to sessionStorage.
   * @param {JSON} credentials - Authorization credentials
   * @param {string} username - Username of the account
   * @param {string} email - Email of the account
   */
  const onLogin = async (credentials, username, email) => {
    sessionStorage.setItem("admin", credentials.admin);
    sessionStorage.setItem("userId", credentials.id);
    sessionStorage.setItem("login", "true");
    sessionStorage.setItem("user", username);
    sessionStorage.setItem("email", email);
    setLoggedIn(true);
    window.location.reload(false);
  };

  /**
   * Logs the user out, clears sessionStorage and refreshes the page.
   */
  const onLogout = () => {
    // store logout
    sessionStorage.clear();
    setLoggedIn(false);
    window.location.reload(false);
  };

  return (
    <>
      <div id="loginCont" className={isFixed ? "fixedLogin" : "nonFixedLogin"}>
        <div>
          {!loggedIn ? (
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

              <div className="buttonCont">
                <button
                  type="button"
                  onClick={handleLogin}
                  className="loginButton"
                >
                  Login
                </button>
                <Link to="/register">
                  <button
                    type="button"
                    className="loginButton"
                    onClick={() => {
                      document
                        .getElementById("loginCont")
                        .classList.toggle("active");
                      document
                        .getElementById("navLogin")
                        .classList.toggle("active");
                    }}
                  >
                    Register
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <p>{`Logged in as ${role}`}</p>
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

Login.propTypes = {
  isFixed: PropTypes.bool.isRequired,
};

export default Login;
