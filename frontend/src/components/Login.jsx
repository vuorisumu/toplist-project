import { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { userLogin, auth } from "../api/users";
import { onLogin } from "../util/permissions";
import UserContext from "../util/UserContext";

/**
 * Reusable login component that renders input fields for the
 * username and password, as well as a login button.
 *
 * @param {boolean} props.isFixed - Whether the position of the
 * component is fixed.
 * @returns {JSX.Element} Login component
 */
function Login({ isFixed }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  // const [user, setUser] = useState("");
  const [active, setActive] = useState(false);
  const loginRef = useRef(null);

  const { user, login, logout } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      document.getElementById("loginCont").classList.remove("active");
      document.getElementById("navLogin").classList.remove("active");
    }
  }, [user]);
  /*
  useEffect(() => {
    if (localStorage.getItem("login")) {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      setUser(localStorage.getItem("user"));
    }
  }, [loggedIn]);
*/
  useEffect(() => {
    const clickOutside = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        if (
          document.getElementById("loginCont").classList.contains("active") &&
          !event.target.classList.contains("loginIcon")
        ) {
          toggleLogin();
        }
      }
    };

    document.addEventListener("click", clickOutside);

    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, [loginRef]);

  const toggleLogin = () => {
    document.getElementById("loginCont").classList.toggle("active");
    document.getElementById("navLogin").classList.toggle("active");
  };

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
      /*
      const res = await userLogin(loginData);
      console.log(res);
      if (!res.error) {
        // successfully log in
        localStorage.setItem("token", res.token);
        const credentials = await auth();
        await onLogin(credentials, res.user_name, res.email);
        setLoggedIn(true);
      } else {
        // clear password
        setPassword("");
      }*/
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
    // store logout
    /*
    localStorage.clear();
    setLoggedIn(false);
    window.location.reload(false);*/
  };

  return (
    <>
      <div
        ref={loginRef}
        id="loginCont"
        className={isFixed ? "fixedLogin" : "nonFixedLogin"}
      >
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
              <p>
                {`Logged in as `}
                <Link
                  to={`/user/${user.user_name}`}
                  onClick={() => {
                    document
                      .getElementById("loginCont")
                      .classList.toggle("active");
                    document
                      .getElementById("navLogin")
                      .classList.toggle("active");
                  }}
                >
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

Login.propTypes = {
  isFixed: PropTypes.bool.isRequired,
};

export default Login;
